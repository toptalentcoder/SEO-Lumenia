import { extractWords } from "./extractWords";
import { fetchPageContent } from "./fetchPageContent";
import { getSemanticKeywords } from "./getSemanticKeywords";
import { processText } from "./processText";
import { Project } from "@/types/project";
import axios from "axios";
import { calculateDynamicOptimizationRanges } from "./assignOptimizationLevel";
import { generateSeoBrief } from "../createSeoEditor/createSeoBrief";
import { calculateSoseoDseoForAllDocs } from "./calculateSOSEOandDSEO";
import { categorizeUrls } from "./categorizeUrls";
import { generateSEOKeywords } from "./generateSEOKeywords";
import { checkUrlPresenceAcrossKeywords } from "./checkUrlPresenceAcrossKeywords";
import { Payload } from "payload";
import { Job } from "bullmq";
import { SERP_API_KEY } from "@/config/apiConfig";

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
    const { query, projectID, email, queryID, language, queryEngine, hl, gl, lr } = data;

    // Update progress to 20% - Starting data collection
    if (job) await job.updateProgress(20);

    if (!query || typeof query !== "string") {
        throw new Error("Missing query in request body");
    }

    // Fetch SERP API data
    const response = await axios.get('https://serpapi.com/search', {
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
    const organicResults: OrganicResult[] = await response.data['organic_results'] || [];
    const paaQuestions = response.data['related_questions'] || [];
    const PAAs = paaQuestions.map((item: { question: string }) => item.question);
    const links = organicResults.map((item: OrganicResult) => item.link);

    // Update progress to 30% - Organic results fetched
    if (job) await job.updateProgress(30);

    // Generate SEO Keywords
    const keywordList: string[] = await generateSEOKeywords(query, gl || "us", fullLanguageName);
    if (!keywordList) throw new Error("Failed to generate keywords");
    console.log("Generated keywords:", keywordList);

    // Limit to top 20 keywords
    const relatedSEOKeywords = keywordList.slice(0, 20);
    if (relatedSEOKeywords.length === 0) {
        console.error("No related SEO keywords generated for query:", query);
        // You can provide default keywords or handle this case accordingly
    }
    console.log("Related SEO Keywords:", relatedSEOKeywords);

    // Check SERP Presence
    const serpPresence = await checkUrlPresenceAcrossKeywords(keywordList, links, gl || "us", hl || "en");

    // Fetch page contents and SEO brief in parallel
    const [pageContentsResult, seoBriefResult] = await Promise.allSettled([
        Promise.all(links.map(fetchPageContent)),
        generateSeoBrief(query, fullLanguageName)
    ]);

    // Update progress to 50% - Content fetched
    if (job) await job.updateProgress(50);

    const resolvedPageContents = pageContentsResult.status === 'fulfilled' ? pageContentsResult.value : [];
    const resolvedSeoBrief = seoBriefResult.status === 'fulfilled' ? seoBriefResult.value : null;

    // Calculate word counts
    const wordCounts = resolvedPageContents.map(content => {
        const words = content ? content.split(/\s+/).filter(Boolean) : [];
        return words.length;
    });

    const processedTokens = resolvedPageContents
        .filter((text): text is string => !!text)
        .map(processText);

    // Update progress to 60% - Text processed
    if (job) await job.updateProgress(60);

    const keywords = extractWords(processedTokens);
    const semanticKeywords = await getSemanticKeywords(keywords, query);

    // Update progress to 70% - Keywords extracted
    if (job) await job.updateProgress(70);

    // Calculate SEO scores
    const { soseoScores, dseoScores } = calculateSoseoDseoForAllDocs(keywords, processedTokens);

    // Calculate optimization levels
    const optimizationLevels = calculateDynamicOptimizationRanges(
        links,
        processedTokens,
        semanticKeywords,
    );

    // Update progress to 80% - SEO analysis complete
    if (job) await job.updateProgress(80);

    // Prepare URL data for categorization
    const urlDataForCategorization = organicResults.map((result, index) => ({
        url: result.link,
        title: result.title,
        content: resolvedPageContents[index] || ''
    }));

    // Categorize URLs
    let urlCategories;
    try {
        urlCategories = await categorizeUrls(urlDataForCategorization, query, language);
    } catch (catError) {
        console.error("Error categorizing URLs:", catError);
        urlCategories = organicResults.map(() => ["Uncategorized"]);
    }

    // Update progress to 90% - URL categorization complete
    if (job) await job.updateProgress(90);

    // Prepare search results
    const searchResults = organicResults.map((result, index) => ({
        title: result.title,
        link: result.link,
        wordCount: wordCounts[index],
        soseo: soseoScores[index],
        dseo: dseoScores[index],
        categories: urlCategories[index] || ["Uncategorized"],
        presenceCount: serpPresence[result.link] || 0
    }));

    // Build cronjob entries
    const today = new Date().toISOString().split("T")[0];
    const cronjob: Record<string, { date: string; position: number }[]> = {};

    organicResults.forEach((result, index) => {
        const position = index + 1;
        const url = result.link;
        cronjob[url] = [{ date: today, position }];
    });

    // Prepare final SEO guide
    const seoGuide = {
        query,
        queryID,
        queryEngine,
        optimizationLevels,
        searchResults,
        language,
        gl,
        seoBrief: resolvedSeoBrief,
        PAAs,
        cronjob,
        createdAt: Date.now(),
        createdBy: email,
        relatedSEOKeywords : relatedSEOKeywords || [],
    };

    // Update user's project with new SEO guide
    if (payload) {
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            throw new Error(`User not found for email: ${email}`);
        }

        const user = users.docs[0];
        let projectId: string;

        if (projectID === "Default") {
            const defaultProject = Array.isArray(user.projects)
                ? (user.projects as Project[]).find(
                    (project) => project.projectName === "Default"
                )
                : undefined;

            if (defaultProject) {
                projectId = defaultProject.projectID;
            } else {
                throw new Error("Default project not found");
            }
        } else {
            projectId = projectID;
        }

        const existingProjects: Project[] = Array.isArray(user.projects)
            ? (user.projects as Project[])
            : [];

        let projectUpdated = false;
        const updatedProjects = existingProjects.map((project) => {
            if (project.projectID === projectId) {
                projectUpdated = true;
                return {
                    ...project,
                    seoGuides: [...(project.seoGuides || []), seoGuide],
                };
            }
            return project;
        });

        if (!projectUpdated) {
            throw new Error(`Project not found: ${projectId}`);
        }

        try {
            await payload.update({
                collection: "users",
                id: user.id,
                data: {
                    projects: updatedProjects,
                },
            });
            console.log("Data saved successfully");
        } catch (error) {
            console.error("Error saving data:", error);
        }
        
    }

    return seoGuide;
} 