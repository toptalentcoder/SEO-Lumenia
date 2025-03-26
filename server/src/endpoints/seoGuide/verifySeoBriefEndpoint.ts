import { withErrorHandling } from "@/middleware/errorMiddleware";
import { verifyContentWithSeoBrief } from "@/service/createSeoEditor/verifySeoBrief";
import { Endpoint, PayloadRequest } from "payload";

// Verify content based on SEO brief
interface SeoBrief {
    objective: string[];
    mainTopics: string[];
    importantQuestions: string[];
    writingStyleAndTone: string[];
    recommendedStyle: string[];
    valueProposition: string[];
}

export const verifySeoBriefEndpoint: Endpoint = {

    path : '/verify_seo_brief',

    method : 'post',

    handler : withErrorHandling(async(req: PayloadRequest): Promise<Response> => {

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // You can replace '*' with specific domains for security reasons
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        };

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        const body = await req.json();
        const { content, seoBrief }: { content: string; seoBrief: SeoBrief } = body;

        if (!content || !seoBrief) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid content or seoBrief" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }


        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        try {
            const verifiedContent = await verifyContentWithSeoBrief(content, seoBrief);
            return new Response(
                JSON.stringify({ success: true, verifiedContent }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        } catch (error) {
            console.error("❌ Error verifying content:", error);
            return new Response(
                JSON.stringify({ error: "Failed to verify content" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }
    })
}