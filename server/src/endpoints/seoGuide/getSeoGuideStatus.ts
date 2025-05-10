import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { seoGuideQueue } from "@/lib/seoGuideQueue";
import { checkRedisConnection } from "@/lib/redis";

export const getSeoGuideStatus: Endpoint = {
    path: "/seoGuideStatus/:jobId",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
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

        // Extract jobId from URL
        const jobId = req.url?.split('/').pop();
        if (!jobId) {
            return new Response(
                JSON.stringify({ 
                    error: "Missing job ID",
                    code: "MISSING_JOB_ID"
                }),
                { 
                    status: 400, 
                    headers: { 
                        "Content-Type": "application/json", 
                        ...corsHeaders 
                    } 
                }
            );
        }

        try {
            const job = await seoGuideQueue.getJob(jobId);

            if (!job) {
                return new Response(
                    JSON.stringify({ 
                        error: "Job not found",
                        code: "JOB_NOT_FOUND"
                    }),
                    { 
                        status: 404, 
                        headers: { 
                            "Content-Type": "application/json", 
                            ...corsHeaders 
                        } 
                    }
                );
            }

            const state = await job.getState();
            const progress = job.progress;
            const result = job.returnvalue;
            const failedReason = job.failedReason;

            return new Response(
                JSON.stringify({
                    status: state,
                    progress,
                    result,
                    failedReason,
                    timestamp: job.timestamp,
                    processedOn: job.processedOn,
                    finishedOn: job.finishedOn,
                    jobId: job.id
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        } catch (error: unknown) {
            console.error("❌ getSeoGuideStatus error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to get job status";
            return new Response(
                JSON.stringify({ 
                    error: errorMessage,
                    code: "STATUS_CHECK_ERROR"
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