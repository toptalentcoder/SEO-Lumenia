import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { Queue } from "bullmq";
import { connection } from "@/lib/redis";

const seoGuideQueue = new Queue('seoGuideQueue', { connection });

export const getSeoGuideResults: Endpoint = {
    path: "/guides/:queryID",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const queryID = req.url?.split('/').pop();
    
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };
    
        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (!queryID) {
            return new Response(JSON.stringify({ error: "Query ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        try {
            // Find the SEO guide by queryID
            const seoGuide = await payload.find({
                collection: "seo-guides",
                where: {
                    queryID: {
                        equals: queryID
                    }
                },
                limit: 1,
            });

            if (!seoGuide.docs.length) {
                // Check if job is still processing
                const jobs = await seoGuideQueue.getJobs(['active', 'waiting', 'delayed']);
                const job = jobs.find(j => j.data.queryID === queryID);

                if (job) {
                    const jobState = await job.getState();
                    const progress = await job.progress;
                    
                    return new Response(JSON.stringify({
                        status: "processing",
                        progress,
                        jobState,
                        message: "SEO guide is still being processed"
                    }), {
                        status: 200,
                        headers: { "Content-Type": "application/json", ...corsHeaders },
                    });
                }

                return new Response(JSON.stringify({ 
                    error: "SEO guide not found",
                    status: "not_found"
                }), {
                    status: 404,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Return the SEO guide results
            return new Response(JSON.stringify({
                status: "completed",
                data: seoGuide.docs[0]
            }), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });

        } catch (error: any) {
            console.error("GET /seo-guide/:queryID error:", error);
            return new Response(JSON.stringify({ 
                error: "Internal Server Error",
                details: error.message 
            }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }
    }),
}; 