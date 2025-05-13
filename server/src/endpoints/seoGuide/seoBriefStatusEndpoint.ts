import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { seoBriefQueue } from "@/lib/seoBriefQueue";
import { checkRedisConnection } from "@/lib/redis";
import { FRONTEND_URL } from "@/config/apiConfig";

export const seoBriefStatusEndpoint: Endpoint = {
    path: "/seoBriefStatus/:jobId",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
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
                JSON.stringify({ error: "Missing job ID" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                }
            );
        }

        try {
            const job = await seoBriefQueue.getJob(jobId);
            if (!job) {
                return new Response(
                    JSON.stringify({ error: "Job not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json", ...corsHeaders }
                    }
                );
            }

            const state = await job.getState();
            const progress = await job.progress;
            const result = job.returnvalue;

            return new Response(
                JSON.stringify({
                    status: state,
                    progress,
                    result: state === 'completed' ? result : undefined,
                    failedReason: state === 'failed' ? job.failedReason : undefined
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                }
            );
        } catch (error) {
            console.error("❌ seoBriefStatus error:", error);
            return new Response(
                JSON.stringify({ error: "Failed to get job status" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                }
            );
        }
    })
}; 