import { withErrorHandling } from "@/middleware/errorMiddleware";
import { createSocialPost } from "@/service/createSocialPost/createSocialPost";
import { Endpoint, PayloadRequest } from "payload";

export const createSocialPostEndpoint : Endpoint = {

    path : '/create_social_post',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {
        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await req.json();
        const { query, tone, platform, content } = body;

        if(!query || !tone || !platform || !content){
            return new Response(JSON.stringify({ error: "Missing or invalid query/keywords" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const socialPost = await createSocialPost({ query, tone, platform, content });

            return new Response(JSON.stringify({ success: true, socialPost }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("❌ generateSeosocialPost error:", error);
            return new Response(JSON.stringify({ error: "Failed to generate SEO socialPost" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    })
}