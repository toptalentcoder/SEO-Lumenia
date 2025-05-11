import { Payload } from "payload";
import axios from "axios";
import { calculateImprovedSerpVolatility } from "./calculateSerpVolatility";
import { SERP_API_KEY } from "@/config/apiConfig";
import mongoose from "mongoose";


interface OrganicResult {
    title: string;
    link: string;
}

function getScoreLevel(score: number): "low" | "medium" | "high" | "extreme" {
    if (score >= 80) return "extreme";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
}

export async function saveDailyVolatilityScores(payload: Payload) {
    const today = new Date().toISOString().split("T")[0];
    const keywords = await payload.find({
        collection: "serpWeatherKeywords",
        limit: 1000,
    });

    const featureCountByCategory: Record<string, Record<string, number>> = {};

    for (const doc of keywords.docs) {
        const { keyword, category } = doc;
        try {
            const response = await axios.get("https://serpapi.com/search", {
                params: {
                    q: keyword,
                    api_key: SERP_API_KEY,
                    hl: "en",
                    gl: "us",
                },
            });

            if (!Array.isArray(response.data.organic_results)) {
                console.warn(`⚠️ No organic_results for ${keyword}`);
                continue;
            }

            const top10 = (response.data.organic_results || []).slice(0, 10).map((item: OrganicResult, index: number) => ({
                rank: index + 1,
                title: item.title,
                link: item.link,
            }));

            const normalizedKeyword = keyword.toLowerCase().trim();

            // Log the search criteria for debugging
            console.log(`Searching for snapshot with keyword: "${normalizedKeyword}" and category: "${category}"`);

            const existing = await payload.find({
                collection: "serpSnapshots",
                where: {
                    keyword: { equals: normalizedKeyword },
                    category: { equals: category }
                },
                limit: 1,
            });

            console.log(`Found ${existing.totalDocs} existing snapshots for this keyword and category`);

            const newEntry = {
                date: today,
                results: top10,
            };

            if (existing.totalDocs > 0) {
                const doc = existing.docs[0];
                console.log(`Updating existing snapshot with ID: ${doc.id}`);

                const prevTracking: { date: string }[] = doc.tracking || [];

                // Remove today's entry if it already exists
                const filteredTracking = prevTracking.filter(t => t.date !== today);

                // Add today's entry and sort descending by date, then keep latest 30
                const prunedTracking = [...filteredTracking, newEntry]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 30);

                await payload.update({
                    collection: "serpSnapshots",
                    id: doc.id,
                    data: {
                        tracking: prunedTracking,
                    },
                });
            } else {
                // Check if there are any records with the same keyword but different case
                const caseInsensitiveCheck = await payload.find({
                    collection: "serpSnapshots",
                    where: {
                        keyword: { like: normalizedKeyword },
                        category: { equals: category }
                    },
                    limit: 1,
                });

                if (caseInsensitiveCheck.totalDocs > 0) {
                    // Found a record with the same keyword but different case
                    const doc = caseInsensitiveCheck.docs[0];
                    console.log(`Found a record with the same keyword but different case. Updating ID: ${doc.id}`);

                    const prevTracking: { date: string }[] = doc.tracking || [];
                    const filteredTracking = prevTracking.filter(t => t.date !== today);
                    const prunedTracking = [...filteredTracking, newEntry]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 30);

                    await payload.update({
                        collection: "serpSnapshots",
                        id: doc.id,
                        data: {
                            keyword: normalizedKeyword, // Normalize the keyword
                            tracking: prunedTracking,
                        },
                    });
                } else {

                    // Create new record only if one doesn't exist for this exact keyword and category
                    console.log(`Creating new snapshot for keyword: "${normalizedKeyword}" and category: "${category}"`);

                    const mongoose = payload.db.connection;
                    const model = await mongoose.model('serpSnapshots')
                    await model.create({
                        data: {
                            keyword: normalizedKeyword,
                            category,
                            tracking: [newEntry],
                        },
                    })

                    // await payload.create({
                    //     collection: "serpSnapshots",
                    //     data: {
                    //         keyword: normalizedKeyword,
                    //         category,
                    //         tracking: [newEntry],
                    //     },
                    // });
                }
            }

            if (!featureCountByCategory[category]) {
                featureCountByCategory[category] = {
                    peopleAlsoAsk: 0,
                    imagePack: 0,
                    related: 0,
                    knowledgeGraph: 0,
                    newsPack: 0,
                    count: 0,
                };
            }

            const stats = featureCountByCategory[category];
            stats.peopleAlsoAsk += response.data.related_questions ? 1 : 0;
            stats.imagePack += response.data.inline_images ? 1 : 0;
            stats.related += response.data.related_searches ? 1 : 0;
            stats.knowledgeGraph += response.data.knowledge_graph ? 1 : 0;
            stats.newsPack += response.data.top_stories ? 1 : 0;
            stats.count++;
        } catch (err) {
            console.error(`❌ SERPAPI error for ${keyword}:`, err);
        }
    }

    const scores = await calculateImprovedSerpVolatility(payload, today);
    console.log("🧪 Calculated scores:", scores);

    for (const category of Object.keys(scores)) {
        const rawScore = scores[category];
        const score = typeof rawScore === "number" && !isNaN(rawScore)
            ? +rawScore.toFixed(2)
            : null;

        if (score === null) {
            console.warn(`⚠️ Skipping category "${category}" due to invalid score:`, rawScore);
            continue;
        }

        const stats = featureCountByCategory[category] || {};
        const count = stats.count || 1;

        await payload.create({
            collection: "serpVolatilityScores",
            data: {
                category,
                date: today,
                score,
                scoreLevel: getScoreLevel(score),
                features: {
                    peopleAlsoAsk: +(100 * (stats.peopleAlsoAsk || 0) / count).toFixed(2),
                    imagePack: +(100 * (stats.imagePack || 0) / count).toFixed(2),
                    related: +(100 * (stats.related || 0) / count).toFixed(2),
                    knowledgeGraph: +(100 * (stats.knowledgeGraph || 0) / count).toFixed(2),
                    newsPack: +(100 * (stats.newsPack || 0) / count).toFixed(2),
                },
            },
        });
    }

    const allScoreRaw =
        Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    const allScore =
        typeof allScoreRaw === "number" && !isNaN(allScoreRaw)
            ? +allScoreRaw.toFixed(2)
            : null;

    if (allScore !== null) {
        await payload.create({
            collection: "serpVolatilityScores",
            data: {
                category: "All",
                date: today,
                score: allScore,
                features: {
                    peopleAlsoAsk: 0,
                    imagePack: 0,
                    related: 0,
                    knowledgeGraph: 0,
                    newsPack: 0,
                },
            },
        });
    } else {
        console.warn("⚠️ Skipping 'All' entry due to invalid score");
    }

    console.log("✅ SERP volatility saved with feature stats on", today);
}
