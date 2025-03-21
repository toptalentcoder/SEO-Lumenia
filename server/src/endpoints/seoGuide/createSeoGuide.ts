import { withErrorHandling } from "@/middleware/errorMiddleware";
import { calculateOptimizationLevels } from "@/service/createSeoGuide/calculateOptimizationLevels";
import { extractWords } from "@/service/createSeoGuide/extractWords";
import { fetchPageContent } from "@/service/createSeoGuide/fetchPageContent";
import { fetchPageContentForKeywordFrequency } from "@/service/createSeoGuide/fetchPageContentForKeywordFrequency";
import { getSemanticKeywords } from "@/service/createSeoGuide/getSemanticKeywords";
import { processText } from "@/service/createSeoGuide/processText";
import { Endpoint, PayloadRequest } from "payload";
import { getJson } from "serpapi";

export const createSeoGuide: Endpoint = {
    path: "/createSeoGuide",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: 'Invalid request: Missing JSON parsing function' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await req.json();
        const {query} = body;

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

            const response = json["organic_results"] ?? [];
            const links = response.map((item: any) => item.link);

            // Fetch and process content
            const pageTexts = await Promise.all(links.map(fetchPageContent));
            const processedText = pageTexts.map(processText);
            const keywords = extractWords(processedText);
            const semanticKeywords = await getSemanticKeywords(keywords, query);

            // Frequency + Optimization Calculation
            const keywordDistributions = await Promise.all(
                links.map((link : any) => fetchPageContentForKeywordFrequency(link, semanticKeywords))
            );

            const optimizationLevels = calculateOptimizationLevels(keywordDistributions);

            return new Response(JSON.stringify({ optimizationLevels }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("❌ createSeoGuide error:", err);
            return new Response(JSON.stringify({ error: "Failed to create SEO guide" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }),
};