import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { seoBriefQueue } from "@/lib/seoBriefQueue";
import { checkRedisConnection } from "@/lib/redis";

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
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400", // 24 hours
        };

        // Handle preflight requests
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        // Check Redis connection
        const isRedisConnected = await checkRedisConnection();
        if (!isRedisConnected) {
            return new Response(
                JSON.stringify({ 
                    error: "Service temporarily unavailable. Please try again in a few moments.",
                    code: "REDIS_CONNECTION_ERROR"
                }),
                { 
                    status: 503, 
                    headers: { 
                        "Content-Type": "application/json", 
                        ...corsHeaders 
                    } 
                }
            );
        }

        if (!req.json) {
            return new Response(JSON.stringify({ error: "Missing JSON body" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        const body = await req.json();
        const { content, seoBrief, language, queryID, email }: { content: string; seoBrief: SeoBrief; language?: string; queryID: string; email: string } = body;

        if (content === undefined || !seoBrief || !queryID || !email) {
            return new Response(JSON.stringify({ error: "Missing content, brief, queryID, or email" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        try {
            // Add job to queue
            const job = await seoBriefQueue.add('verifySeoBrief', {
                content,
                seoBrief,
                language,
                queryID,
                email
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: {
                    age: 3600, // Keep completed jobs for 1 hour
                    count: 100 // Keep last 100 completed jobs
                },
                removeOnFail: {
                    age: 24 * 3600 // Keep failed jobs for 24 hours
                }
            });

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "SEO brief verification started",
                    jobId: job.id
                }),
                {
                    status: 202,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        } catch (error) {
            console.error("❌ verifySeoBrief error:", error);
            return new Response(JSON.stringify({ error: "Failed to verify content" }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }
    }),
};
