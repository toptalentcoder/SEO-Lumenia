import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoQuestions } from "@/service/createSeoEditor/generateSeoQuestionss";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoQuestionsEndpoint : Endpoint = {

    path : '/generate_seo_questions',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {
        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const { payload } = req;
        const body = await req.json();
        const { query, keywords, language } = body;

        if (!query || typeof query !== "string" || !Array.isArray(keywords)) {
            return new Response(JSON.stringify({ error: "Missing or invalid query/keywords" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const questions = await generateSeoQuestions({ query, keywords, language });

            return new Response(JSON.stringify({ success: true, questions }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
                console.error("❌ generateSeoQuestions error:", error);
                return new Response(JSON.stringify({ error: "Failed to generate SEO questions" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

    })
}