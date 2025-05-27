import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { seoGuideQueue } from "@/lib/seoGuideQueue";
import { checkRedisConnection } from "@/lib/redis";
import { FRONTEND_URL } from "@/config/apiConfig";

export const createSeoGuide: Endpoint = {
    path: "/createSeoGuide",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400"
        };

        // Handle preflight OPTIONS request
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
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

        const { payload } = req;
        const body = await req.json();
        const { query, projectID, email, queryID, language, queryEngine, hl, gl, lr } = body;

        console.log("Received request body:", body);

        if (!query || typeof query !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing query in request body" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        try {
            console.log("Adding job to the queue...");
            // Add job to queue with retention settings
            const job = await seoGuideQueue.add('createSeoGuide', {
                query,
                projectID,
                email,
                queryID,
                language,
                queryEngine,
                hl,
                gl,
                lr
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

            console.log("Job added to queue with ID:", job.id);

            return new Response(
                JSON.stringify({ 
                    success: true, 
                    message: "SEO guide creation started",
                    jobId: job.id
                }),
                {
                    status: 202,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        } catch (error: unknown) {
            console.error("❌ createSeoGuide error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to create SEO guide";
            return new Response(
                JSON.stringify({ 
                    error: errorMessage,
                    code: "QUEUE_ERROR"
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }
    }),
};