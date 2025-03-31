import { withErrorHandling } from "@/middleware/errorMiddleware";
import { verifyContentWithSeoBrief } from "@/services/createSeoEditor/verifySeoBrief";
import { Endpoint, PayloadRequest } from "payload";

interface SeoBrief {
    objective: string[];
    mainTopics: string[];
    importantQuestions: string[];
    writingStyleAndTone: string[];
    recommendedStyle: string[];
    valueProposition: string[];
}

export const verifySeoBriefEndpoint: Endpoint = {
    path: "/verify_seo_brief",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        if (!req.json) {
            return new Response(JSON.stringify({ error: "Missing JSON body" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        const body = await req.json();
        const { content, seoBrief }: { content: string; seoBrief: SeoBrief } = body;

        if (!content || !seoBrief) {
            return new Response(JSON.stringify({ error: "Missing content or brief" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        try {
            const result = await verifyContentWithSeoBrief(content, seoBrief);

            return new Response(
                JSON.stringify({
                success: true,
                verificationResult: {
                    objective: result.objective,
                    mainTopics: result.mainTopics,
                    importantQuestions: result.importantQuestions,
                    writingStyleAndTone: result.writingStyleAndTone,
                    recommendedStyle: result.recommendedStyle,
                    valueProposition: result.valueProposition,
                },
                improvementText: result.improvementText,
                }),
                {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        } catch (_error) {
            return new Response(JSON.stringify({ error: "Failed to verify content" }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }
    }),
};
