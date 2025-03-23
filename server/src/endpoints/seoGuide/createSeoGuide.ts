import { withErrorHandling } from "@/middleware/errorMiddleware";
import { calculateOptimizationLevels } from "@/service/createSeoGuide/calculateOptimizationLevels";
import { extractWords } from "@/service/createSeoGuide/extractWords";
import { fetchPageContent } from "@/service/createSeoGuide/fetchPageContent";
import { fetchPageContentForKeywordFrequency } from "@/service/createSeoGuide/fetchPageContentForKeywordFrequency";
import { getSemanticKeywords } from "@/service/createSeoGuide/getSemanticKeywords";
import { processText } from "@/service/createSeoGuide/processText";
import { Project } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";
import { getJson } from "serpapi";

interface OrganicResult {
    title : string;
    link: string;
    // Add other properties if needed
}

export const createSeoGuide: Endpoint = {
    path: "/createSeoGuide",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: 'Invalid request: Missing JSON parsing function' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const {payload} = req;
        const body = await req.json();
        const {query, projectID, email} = body;

        const SERP_API_KEY = process.env.SERP_API_KEY;

        if (!query || typeof query !== "string") {
            return new Response(JSON.stringify({ error: "Missing query in request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            // Fetch SERP results
            const json = await new Promise<any>((resolve, reject) => {
                getJson(
                    {
                        engine: "google",
                        q: query,
                        api_key: SERP_API_KEY,
                    },
                    (data) => {
                        if (!data) return reject("SERP API returned null");
                        resolve(data);
                    }
                );
            });

            const organicResults: OrganicResult[] = json["organic_results"] ?? [];

            const links = organicResults.map((item: OrganicResult) => item.link);

            // Fetch and process content
            const pageTexts = await Promise.all(links.map(fetchPageContent));
            const processedText = pageTexts.filter((text): text is string => text !== null).map(processText);
            const keywords = extractWords(processedText);
            const semanticKeywords = await getSemanticKeywords(keywords, query);

            // Frequency + Optimization Calculation
            const keywordDistributions = await Promise.all(
                links.map((link: string) => fetchPageContentForKeywordFrequency(link, semanticKeywords))
            );

            const optimizationLevels = calculateOptimizationLevels(keywordDistributions);

            const seoGuides = {
                "query" : query,
                "graphData" : optimizationLevels,
                "searchResults": organicResults.map(({ title, link }) => ({ title, link }))
            }

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

            let projectId : string ;

            if (projectID === "Default") {
                const defaultProject = Array.isArray(user.projects)
                    ? (user.projects as Project[]).find((project) => project.projectName === "Default")
                    : undefined;

                if (defaultProject) {
                    projectId = defaultProject.projectID;
                } else {
                    return new Response(
                        JSON.stringify({ error: "Default project not found" }),
                        { status: 404, headers: { "Content-Type": "application/json" } }
                    );
                }
            }

            // ✅ Ensure projects array is correctly typed
            const existingProjects: Project[] = Array.isArray(user.projects) ? (user.projects as Project[]) : [];

            let projectUpdated = false;
            const updatedProjects = existingProjects.map((project) => {
                if (project.projectID === projectId) {
                    projectUpdated = true;
                    return {
                        ...project,
                        seoGuides: [...(project.seoGuides || []), seoGuides], // Append new SEO guide
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
                JSON.stringify({ success: true }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
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