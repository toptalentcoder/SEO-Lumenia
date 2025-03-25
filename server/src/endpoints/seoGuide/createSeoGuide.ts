import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoBrief } from "@/service/createSeoEditor/createSeoBrief";
import { calculateOptimizationLevels } from "@/service/createSeoGuide/calculateOptimizationLevels";
import { extractWords } from "@/service/createSeoGuide/extractWords";
import { fetchPageContent } from "@/service/createSeoGuide/fetchPageContent";
import { getSemanticKeywords } from "@/service/createSeoGuide/getSemanticKeywords";
import { processText } from "@/service/createSeoGuide/processText";
import { Project } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";
import { getJson } from "serpapi";

interface OrganicResult {
    title: string;
    link: string;
}

interface SerpApiResponse {
    organic_results: OrganicResult[];
    // Add more fields if you use them elsewhere
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
            const json = await new Promise<SerpApiResponse>((resolve, reject) => {
                getJson(
                    {
                        engine: "google",
                        q: query,
                        api_key: SERP_API_KEY,
                    },
                    (data: unknown) => {
                        if (!data || typeof data !== 'object' || !('organic_results' in data)) {
                            return reject("SERP API returned unexpected structure");
                        }

                        // Type assertion here
                        resolve(data as SerpApiResponse);
                    }
                );
            });

            const organicResults: OrganicResult[] = json["organic_results"] ?? [];
            const links = organicResults.map((item: OrganicResult) => item.link);

            // Generate SEO brief concurrently
            const seoBriefPromise = generateSeoBrief(query);

            // Fetch page content concurrently
            const pageContentsPromise = Promise.all(links.map(fetchPageContent));

            // Process the results concurrently
            const [pageContents, seoBrief] = await Promise.all([pageContentsPromise, seoBriefPromise]);

            const processedTokens = pageContents
                .filter((text): text is string => !!text)
                .map(processText);

            const keywords = extractWords(processedTokens);
            const semanticKeywords = await getSemanticKeywords(keywords, query);

            const keywordFrequencies = processedTokens.map((tokens) => {
                const frequencyMap = new Map<string, number>();
                const keywordSet = new Set(semanticKeywords);

                for (const token of tokens) {
                    if (keywordSet.has(token)) {
                        frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
                    }
                }

                const result: Record<string, number> = {};
                for (const keyword of semanticKeywords) {
                    result[keyword] = frequencyMap.get(keyword) || 0;
                }

                return result;
            });

            const optimizationLevels = calculateOptimizationLevels(keywordFrequencies);

            const seoGuides = {
                query,
                queryID,
                queryEngine,
                graphData: optimizationLevels,
                searchResults: organicResults.map(({ title, link }) => ({ title, link })),
                language,
                seoBrief,
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
                JSON.stringify({ success: true, seoBrief }),
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
