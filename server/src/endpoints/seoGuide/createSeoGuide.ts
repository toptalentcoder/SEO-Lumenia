import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoBrief } from "@/service/createSeoEditor/createSeoBrief";
import { extractWords } from "@/service/createSeoGuide/extractWords";
import { fetchPageContent } from "@/service/createSeoGuide/fetchPageContent";
import { getSemanticKeywords } from "@/service/createSeoGuide/getSemanticKeywords";
import { processText } from "@/service/createSeoGuide/processText";
import { Project } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";
import axios from "axios";
import { calculateSOSEOandDSEO } from "@/service/createSeoGuide/calculateSOSEO";
import { calculateDynamicOptimizationRanges } from "@/service/createSeoGuide/assignOptimizationLevel";

interface OrganicResult {
    title: string;
    link: string;
    soseo?: number; // Optional property for SEO optimization level
    dseo?: number;  // Optional property for SEO optimization level
}

export const createSeoGuide: Endpoint = {
    path: "/createSeoGuide",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { payload } = req;
        const body = await req.json();
        const { query, projectID, email, queryID, language, queryEngine } = body;

        const SERP_API_KEY = process.env.SERP_API_KEY;

        if (!query || typeof query !== "string") {
            return new Response(JSON.stringify({ error: "Missing query in request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            // Fetch SERP API data using axios (including PAA questions)
            const response = await axios.get('https://serpapi.com/search', {
                params: {
                    q: query,
                    api_key: SERP_API_KEY,
                },
            });

            const organicResults: OrganicResult[] =await response.data['organic_results'] || [];
            const paaQuestions = response.data['related_questions'] || [];
            const PAAs = paaQuestions.map((item : {question : string}) => item.question);
            const links = organicResults.map((item: OrganicResult) => item.link);

            // Generate SEO brief concurrently
            const seoBriefPromise = generateSeoBrief(query);

            // Fetch page content concurrently
            const pageContentsPromise = Promise.all(links.map(fetchPageContent));

            // Process the results concurrently
            const [pageContents, seoBrief] = await Promise.all([pageContentsPromise, seoBriefPromise]);

            // Calculate the word count for each URL's content
            const wordCounts = pageContents.map(content => {
                const words = content ? content.split(/\s+/).filter(Boolean) : []; // Split by spaces and filter out empty strings, handle null case
                return words.length; // Return word count
            });


            const processedTokens = pageContents
                .filter((text): text is string => !!text)
                .map(processText);

            const keywords = extractWords(processedTokens);
            const semanticKeywords = await getSemanticKeywords(keywords, query);

            // Calculate dynamic optimization ranges for each keyword across all URLs
            const optimizationLevels = calculateDynamicOptimizationRanges(
                links,
                processedTokens,
                semanticKeywords
            );

            // Add word count to each searchResult
            const searchResults = organicResults.map((result, index) => ({
                title: result.title,
                link: result.link,
                wordCount: wordCounts[index], // Add the word count for each URL's content
            }));

            const seoGuides = {
                query,
                queryID,
                queryEngine,
                optimizationLevels,
                searchResults,
                // seoScores,
                language,
                seoBrief,
                PAAs,
                createdAt : Date.now()
            };

            const users = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });

            if (!users.docs.length) {
                return new Response(
                    JSON.stringify({ error: `User not found for email: ${email}` }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
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
                    return new Response(
                        JSON.stringify({ error: "Default project not found" }),
                        { status: 404, headers: { "Content-Type": "application/json" } }
                    );
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
                        seoGuides: [...(project.seoGuides || []), seoGuides],
                    };
                }
                return project;
            });

            if (!projectUpdated) {
                return new Response(
                    JSON.stringify({ error: "Project not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(
                JSON.stringify({ success: true, seoGuides }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (err) {
            console.error("❌ createSeoGuide error:", err);
            return new Response(JSON.stringify({ error: "Failed to create SEO guide" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }),
};