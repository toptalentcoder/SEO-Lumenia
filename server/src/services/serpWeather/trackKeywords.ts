import { Payload } from "payload";
import axios from "axios";
import { calculateImprovedSerpVolatility } from "./calculateSerpVolatility";

const SERP_API_KEY = process.env.SERP_API_KEY;
const today = new Date().toISOString().split("T")[0];

interface OrganicResult {
    title: string;
    link: string;
}

export async function saveDailyVolatilityScores(payload: Payload) {
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

            const top10 = (response.data.organic_results || []).slice(0, 10).map((item: OrganicResult, index: number) => ({
                rank: index + 1,
                title: item.title,
                link: item.link,
            }));

            const todayEntry = {
                date: today,
                results: top10,
            };

            const existing = await payload.find({
                collection: "serpSnapshots",
                where: { keyword: { equals: keyword.toLowerCase().trim() } },
                limit: 1,
            });

            if (existing.totalDocs > 0) {
                const doc = existing.docs[0];
                const prevTracking = doc.tracking || [];

                const updatedTracking = [
                    ...prevTracking.filter((t: { date: string }) => t.date !== today),
                    todayEntry,
                ];

                await payload.update({
                    collection: "serpSnapshots",
                    id: doc.id,
                    data: { tracking: updatedTracking },
                });
            } else {
                await payload.create({
                    collection: "serpSnapshots",
                    data: {
                        keyword: keyword.toLowerCase().trim(),
                        category,
                        tracking: [todayEntry],
                    },
                });
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
