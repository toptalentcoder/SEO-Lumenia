import { withErrorHandling } from "@/middleware/errorMiddleware"
import { Endpoint, PayloadRequest } from "payload"
import { generateBrainstormerIdeas } from '../../../services/contentStrategy/generateIdeas/generateBrainstormer.js';

export const generateBrainstormerIdeasEndpoint: Endpoint = {

    path : '/generate-brainstormer-ideas',
    method : 'post',
    handler : withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;
        const body = req.json ? await req.json() : {};
        const { query, language } = body;

        if (!query) {
            return new Response(JSON.stringify({ error: "Missing query" }), {
                status: 400,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
            });
        }
        if (!language) {
            return new Response(JSON.stringify({ error: "Missing language" }), {
                status: 400,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
            });
        }

        const result = await generateBrainstormerIdeas(query, language);

        if (result.error) {
            return new Response(JSON.stringify({ error: result.error }), {
                status: 500,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
            });
        }

        return new Response(
            JSON.stringify({ data: result }),
            { 
                status: 200, 
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                } 
            }
        );
    }),
}