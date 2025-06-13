import { withErrorHandling } from "@/middleware/errorMiddleware"
import { Endpoint, PayloadRequest } from "payload"
import { generateBrainstormerIdeas } from '../../../services/contentStrategy/generateIdeas/generateBrainstormer';
import { FRONTEND_URL } from "@/config/apiConfig";

export const generateBrainstormerIdeasEndpoint: Endpoint = {

    path : '/generate-brainstormer-ideas',
    method : 'post',
    handler : withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;

        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                ...corsHeaders,
                },
            });
        }

        const body = req.json ? await req.json() : {};
        const { query, language } = body;

        if (!req.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        if (!query) {
            return new Response(JSON.stringify({ error: "Missing query" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }
        if (!language) {
            return new Response(JSON.stringify({ error: "Missing language" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        const result = await generateBrainstormerIdeas(query, language);
        const transformedIdeas = result.map((idea: any) => ({
            ...idea,
            keywords: idea.keywords.map((kw: string) => ({ keyword: kw })),
            outline: idea.outline
                .split(/\d+\.\s/) // split by numbered steps
                .filter(Boolean) // remove empty strings
                .map((step: string) => ({ step: step.trim() })),
        }));

        // Save to brainstormIdeas collection
        await payload.create({
            collection: "brainstormIdeas",
            data: {
                user: req.user.id,
                query,
                language,
                ideas: transformedIdeas,
            },
        });

        return new Response(
            JSON.stringify({ data: transformedIdeas }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                }
            }
        );
    }),
}