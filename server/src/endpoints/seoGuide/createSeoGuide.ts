import { withErrorHandling } from "@/middleware/errorMiddleware";
import { extractWords } from "@/services/createSeoGuide/extractWords";
import { fetchPageContent } from "@/services/createSeoGuide/fetchPageContent";
import { getSemanticKeywords } from "@/services/createSeoGuide/getSemanticKeywords";
import { processText } from "@/services/createSeoGuide/processText";
import { Project } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";
import axios from "axios";
import { calculateDynamicOptimizationRanges } from "@/services/createSeoGuide/assignOptimizationLevel";
import { generateSeoBrief } from "@/services/createSeoEditor/createSeoBrief";
import { calculateSoseoDseoForAllDocs } from "@/services/createSeoGuide/calculateSOSEOandDSEO";
import { categorizeUrls } from "@/services/createSeoGuide/categorizeUrls";
import { generateSEOKeywords } from "@/services/createSeoGuide/generateSEOKeywords";
import { checkUrlPresenceAcrossKeywords } from "@/services/createSeoGuide/checkUrlPresenceAcrossKeywords";

import { seoGuideQueue } from "@/lib/seoGuideQueue";
import { checkRedisConnection } from "@/lib/redis";
interface OrganicResult {
    title: string;
    link: string;
    soseo?: number; // Optional property for SEO optimization level
    dseo?: number;  // Optional property for SEO optimization level
}

const hlToFullLanguageMap: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    pl: 'Polish',
    ro: 'Romanian',
    nl: 'Dutch',
    ar: 'Arabic',
    hi: 'Hindi',
    ja: 'Japanese',
    zh: 'Chinese',
    ru: 'Russian',
    tr: 'Turkish'
    // Add more if needed
};

export const createSeoGuide: Endpoint = {
    path: "/createSeoGuide",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
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