import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoOutline } from "@/service/createSeoEditor/generateSeoOutline";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoOutlineEndpoint : Endpoint = {

    path : '/generate_seo_outline',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {
        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await req.json();
        const { query, keywords, language } = body;

        if (!query || typeof query !== "string" || !Array.isArray(keywords)) {
            return new Response(JSON.stringify({ error: "Missing or invalid query/keywords" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const outlines = await generateSeoOutline({ query, keywords, language });

            return new Response(JSON.stringify({ success: true, outlines }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
                console.error("❌ generateSeooutlines error:", error);
                return new Response(JSON.stringify({ error: "Failed to generate SEO outlines" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

    })
}