import { extractWords } from "./extractWords";
import { fetchPageContent } from "./fetchPageContent";
import { getSemanticKeywords } from "./getSemanticKeywords";
import { processText } from "./processText";
import { Project } from "@/types/project";
import axios from "axios";
import { calculateDynamicOptimizationRanges } from "./assignOptimizationLevel";
import { generateSeoBrief } from "./createSeoEditor/createSeoBrief";
import { calculateSoseoDseoForAllDocs } from "./calculateSOSEOandDSEO";
import { categorizeUrls } from "./categorizeUrls";
import { generateSEOKeywords } from "./generateSEOKeywords";
import { checkUrlPresenceAcrossKeywords } from "./checkUrlPresenceAcrossKeywords";
import { Payload } from "payload";
import { Job } from "bullmq";
import { SERP_API_KEY } from "@/config/apiConfig";
import { countWordsPerPage } from "./countWordsPerUrlContent";

interface OrganicResult {
    title: string;
    link: string;
    soseo?: number;
    dseo?: number;
}

interface SeoGuideJobData {
    query: string;
    projectID: string;
    email: string;
    queryID: string;
    language: string;
    queryEngine: string;
    hl: string;
    gl: string;
    lr: string;
}

const hlToFullLanguageMap: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    pl: 'Polish',
    ro: 'Romanian',
    nl: 'Dutch',
    ar: 'Arabic',
    hi: 'Hindi',
    ja: 'Japanese',
    zh: 'Chinese',
    ru: 'Russian',
    tr: 'Turkish'
};

export async function processSeoGuide(data: SeoGuideJobData, payload?: Payload, job?: Job) {
    console.log("processSeoGuide started with data:", JSON.stringify(data, null, 2));

    const { query, projectID, email, queryID, language, queryEngine, hl, gl, lr } = data;

    if (!payload) {
        throw new Error("Payload instance is not available");
    }

    // Validate required fields
    if (!query || typeof query !== "string") {
        throw new Error("Missing or invalid query");
    }

    if (!projectID) {
        throw new Error("Missing projectID");
    }

    if (!email) {
        throw new Error("Missing email");
    }

    try {
        // Step 1: Find the user
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            console.error("User not found:", { email });
            throw new Error(`User not found for email: ${email}`);
        }

        const user = users.docs[0];

        // Step 2: Resolve the project with better error handling
        const numericProjectID = Number(projectID);
        if (isNaN(numericProjectID)) {
            console.error("Invalid projectID:", { 
                original: projectID, 
                type: typeof projectID 
            });
            throw new Error(`Invalid projectID: ${projectID}`);
        }

        // First, let's check if the project exists at all
        const allProjects = await payload.find({
            collection: 'projects',
            where: {
                or: [
                    {
                        projectID: {
                            equals: numericProjectID,
                        },
                    },
                    {
                        projectID: {
                            equals: projectID, // Also try as string
                        },
                    }
                ]
            },
        });

        // Now search for the specific user's project
        const projectRes = await payload.find({
            collection: 'projects',
            where: {
                and: [
                    {
                        user: {
                            equals: user.id,
                        },
                    },
                    {
                        or: [
                            {
                                projectID: {
                                    equals: numericProjectID,
                                },
                            },
                            {
                                projectID: {
                                    equals: projectID, // Also try as string
                                },
                            }
                        ]
                    },
                ],
            },
            limit: 1,
        });

        if (!projectRes.docs.length) {
            // Get all projects for this user to help debug
            const userProjects = await payload.find({
                collection: 'projects',
                where: {
                    user: {
                        equals: user.id,
                    },
                },
            });

            console.error("Project search failed. Details:", {
                userId: user.id,
                projectID: numericProjectID,
                originalProjectID: projectID,
                email: user.email,
                userProjects: userProjects.docs.map(p => ({
                    id: p.id,
                    projectID: p.projectID,
                    projectName: p.projectName,
                    userId: p.user
                }))
            });

            throw new Error(`Project not found for user: ${user.email} and projectID: ${projectID} (numeric: ${numericProjectID})`);
        }

        const project = projectRes.docs[0];

        // Update progress to 20% - Project verification complete
        if (job) await job.updateProgress(20);

        // Fetch SERP API data
        const serpResponse = await axios.get('https://serpapi.com/search', {
            params: {
                q: query,
                api_key: SERP_API_KEY,
                hl: hl || 'en',
                gl: gl || 'us',
                lr: lr || 'lang_en'
            },
            timeout: 300000,
        });

        const fullLanguageName = hlToFullLanguageMap[language] || 'English';
        const organicResults = (serpResponse.data['organic_results'] || []) as OrganicResult[];
        
        // Validate organic results
        if (!organicResults || organicResults.length === 0) {
            console.error("No organic results found for query:", query);
            throw new Error("No search results found for the given query");
        }

        const paaQuestions = serpResponse.data['related_questions'] || [];
        const PAAs = paaQuestions.map((item: { question: string }) => item.question);
        const links = organicResults.map((item: OrganicResult) => item.link);

        // Update progress to 30% - Organic results fetched
        if (job) await job.updateProgress(30);

        // Generate SEO Keywords
        let keywordList: string[] = [];
        try {
            keywordList = await generateSEOKeywords(query, gl || "us", fullLanguageName);
            if (!keywordList || keywordList.length === 0) {
                console.error("No keywords generated for query:", query);
                throw new Error("Failed to generate keywords");
            }
        } catch (error) {
            console.error("Error generating keywords:", error);
            throw new Error(`Failed to generate keywords: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Limit to top 20 keywords
        const relatedSEOKeywords = keywordList.slice(0, 20);
        if (relatedSEOKeywords.length === 0) {
            console.error("No related SEO keywords generated for query:", query);
            // You can provide default keywords or handle this case accordingly
        }

        // Check SERP Presence
        const serpPresence = await checkUrlPresenceAcrossKeywords(keywordList, links, gl || "us", hl || "en");

        // Fetch page contents and SEO brief in parallel
        const [pageContentsResult, seoBriefResult] = await Promise.allSettled([
            Promise.all(links.map(async (link) => {
                try {
                    const content = await fetchPageContent(link);
                    if (!content) {
                        console.warn(`No content fetched for URL: ${link}`);
                        return ""; // Return empty string instead of undefined
                    }
                    return content;
                } catch (error) {
                    console.error(`Error fetching content for ${link}:`, error);
                    return ""; // Return empty string on error
                }
            })),
            generateSeoBrief(query, fullLanguageName)
        ]);

        if (pageContentsResult.status === 'rejected') {
            console.error("Error fetching page contents:", pageContentsResult.reason);
            throw new Error("Failed to fetch page contents");
        }

        if (seoBriefResult.status === 'rejected') {
            console.error("Error generating SEO brief:", seoBriefResult.reason);
            throw new Error("Failed to generate SEO brief");
        }

        // Update progress to 50% - Content fetched
        if (job) await job.updateProgress(50);

        const resolvedPageContents = pageContentsResult.status === 'fulfilled' ? pageContentsResult.value : [];
        
        // Validate page contents
        if (!resolvedPageContents || resolvedPageContents.length === 0) {
            console.error("No page contents resolved");
            throw new Error("Failed to resolve page contents");
        }

        const resolvedSeoBriefRaw = seoBriefResult.status === 'fulfilled'
            ? seoBriefResult.value
            : {
                primaryIntent: '',
                objective: [],
                mainTopics: [],
                importantQuestions: [],
                writingStyleAndTone: [],
                recommendedStyle: [],
                valueProposition: [],
            };

        const mappedSeoBrief = {
            primaryIntent: resolvedSeoBriefRaw.primaryIntent || '',
            objective: (resolvedSeoBriefRaw.objective || []).map((o: string) => ({ value: o })),
            mainTopics: (resolvedSeoBriefRaw.mainTopics || []).map((t: string) => ({ value: t })),
            importantQuestions: (resolvedSeoBriefRaw.importantQuestions || []).map((q: string) => ({ value: q })),
            writingStyleAndTone: (resolvedSeoBriefRaw.writingStyleAndTone || []).map((s: string) => ({ value: s })),
            recommendedStyle: (resolvedSeoBriefRaw.recommendedStyle || []).map((s: string) => ({ value: s })),
            valueProposition: (resolvedSeoBriefRaw.valueProposition || []).map((v: string) => ({ value: v })),
        };

        // Calculate word counts with validation
        const wordCounts = countWordsPerPage(resolvedPageContents);
        if (!wordCounts || wordCounts.length === 0) {
            console.error("No word counts generated");
            throw new Error("Failed to generate word counts");
        }

        // Process text with validation
        const processedTokens = resolvedPageContents
            .filter((text): text is string => !!text)
            .map(text => {
                try {
                    const processed = processText(text);
                    return processed; // processText already returns string[]
                } catch (error) {
                    console.error("Error processing text:", error);
                    return []; // Return empty array on error
                }
            });

        if (!processedTokens || processedTokens.length === 0) {
            console.error("No processed tokens generated");
            throw new Error("Failed to process text");
        }

        // Update progress to 60% - Text processed
        if (job) await job.updateProgress(60);

        // Extract keywords with validation
        const keywords = extractWords(processedTokens);
        if (!keywords || keywords.length === 0) {
            console.error("No keywords extracted");
            throw new Error("Failed to extract keywords");
        }

        const semanticKeywords = await getSemanticKeywords(keywords, query);
        if (!semanticKeywords || semanticKeywords.length === 0) {
            console.error("No semantic keywords generated");
            throw new Error("Failed to generate semantic keywords");
        }

        // Update progress to 70% - Keywords extracted
        if (job) await job.updateProgress(70);

        // Calculate SEO scores with validation
        const { soseoScores, dseoScores } = calculateSoseoDseoForAllDocs(keywords, processedTokens);
        if (!soseoScores || !dseoScores || soseoScores.length === 0 || dseoScores.length === 0) {
            console.error("No SEO scores calculated");
            throw new Error("Failed to calculate SEO scores");
        }

        // Calculate optimization levels with validation
        const optimizationLevels = await calculateDynamicOptimizationRanges(
            links,
            semanticKeywords,
        );
        if (!optimizationLevels || Object.keys(optimizationLevels).length === 0) {
            console.error("No optimization levels calculated");
            throw new Error("Failed to calculate optimization levels");
        }

        // Update progress to 80% - SEO analysis complete
        if (job) await job.updateProgress(80);

        // Prepare URL data for categorization with validation
        const urlDataForCategorization = organicResults.map((result, index) => ({
            url: result.link,
            title: result.title,
            content: resolvedPageContents[index] || ''
        }));

        if (!urlDataForCategorization || urlDataForCategorization.length === 0) {
            console.error("No URL data prepared for categorization");
            throw new Error("Failed to prepare URL data for categorization");
        }

        // Categorize URLs with better error handling
        let urlCategories: string[][] = [];
        try {
            urlCategories = await categorizeUrls(urlDataForCategorization, query, language);
            if (!urlCategories || urlCategories.length === 0) {
                console.warn("No categories returned from categorization, using default");
                urlCategories = organicResults.map(() => ["Uncategorized"]);
            }
        } catch (catError) {
            console.error("Error categorizing URLs:", catError);
            urlCategories = organicResults.map(() => ["Uncategorized"]);
        }

        // Update progress to 90% - URL categorization complete
        if (job) await job.updateProgress(90);

        // Prepare search results with validation
        const searchResults = organicResults.map((result, index) => {

            // Ensure we have valid data for each field
            const categories = urlCategories[index] || ["Uncategorized"];
            const wordCount = wordCounts[index] || 0;
            const soseo = soseoScores[index] || 0;
            const dseo = dseoScores[index] || 0;
            const presenceCount = serpPresence[result.link] || 0;

            return {
                title: result.title || "Untitled",
                link: result.link || "",
                wordCount,
                soseo,
                dseo,
                categories: categories.map((value) => ({ value })),
                presenceCount
            };
        });

        // Validate search results
        if (!searchResults || searchResults.length === 0) {
            console.error("No search results generated");
            throw new Error("Failed to generate search results");
        }

        // Build cronjob entries with validation
        const today = new Date().toISOString().split("T")[0];
        const cronjob: Record<string, { date: string; position: number }[]> = {};

        organicResults.forEach((result, index) => {
            if (result && result.link) {
                const position = index + 1;
                const url = result.link;
                cronjob[url] = [{ date: today, position }];
            }
        });

        // Validate cronjob entries
        if (Object.keys(cronjob).length === 0) {
            console.error("No valid URLs found for cronjob creation");
            throw new Error("Failed to create cronjob entries: No valid URLs found");
        }

        // Update user's project with new SEO guide
        if (payload) {
            const seoGuide = {
                project: project.id,
                query,
                queryID,
                queryEngine,
                optimizationLevels,
                searchResults,
                language,
                gl,
                seoBrief: mappedSeoBrief,
                PAAs: PAAs.map((q: string) => ({ question: q })),
                cronjob: Object.entries(cronjob).map(([url, positions]) => ({
                    url,
                    positions
                })),
                createdAt: Date.now(),
                createdBy: email,
                relatedSEOKeywords: relatedSEOKeywords.map(k => ({ keyword: k })),
            };

            // Step 3: Create new SEO Guide linked to the project
            try {
                await payload.create({
                    collection: 'seo-guides',
                    data: seoGuide
                });

                console.log("SEO guide created successfully.");
            } catch (error) {
                console.error("Error creating SEO guide:", error);
                throw new Error("Failed to save SEO guide to database.");
            }
        }

        return true;
    } catch (error) {
        console.error("Error in SEO guide processing:", error);
        throw error;
    }
}