import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { Queue, QueueEvents } from "bullmq";
import { connection } from "@/lib/redis";

const seoGuideQueue = new Queue('seoGuideQueue', { connection });
const queueEvents = new QueueEvents('seoGuideQueue', { connection });



export const createSeoGuide: Endpoint = {
    path: "/seo-guide",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const body = typeof req.json === "function" ? await req.json() : {};
        const { query, projectID, language, queryEngine, hl, gl, lr } = body;
    
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };
    
        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        let userId: string;
        let email: string;

        // Check if user is logged in
        if (req.user) {
            userId = req.user.id;
            email = req.user.email;
        } else {
            // For non-logged-in users, check API key
            const authHeader = req.headers.get('Authorization');
            const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

            if (!apiKey) {
                return new Response(JSON.stringify({ error: "API key is required for non-logged-in users" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Find user by API key
            const users = await payload.find({
                collection: "users",
                where: { apiKey: { equals: apiKey } },
                limit: 1,
            });

            if (!users.docs.length) {
                return new Response(JSON.stringify({ error: "Invalid API key" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            userId = users.docs[0].id;
            email = users.docs[0].email;
        }

        if (!query || !projectID || !language) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        try {
            // Convert projectID to number and validate
            const numericProjectID = Number(projectID);
            if (isNaN(numericProjectID)) {
                return new Response(JSON.stringify({ error: "Invalid projectID format" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Verify project exists and belongs to user
            const project = await payload.find({
                collection: "projects",
                where: {
                    and: [
                        {
                            user: { equals: userId }
                        },
                        {
                            projectID: { equals: numericProjectID }
                        }
                    ]
                },
                limit: 1,
            });

            if (!project.docs.length) {
                return new Response(JSON.stringify({ error: "Project not found or access denied" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Generate a unique queryID
            const now = Date.now().toString(); // e.g., "1718540163624"
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 digits
            const queryID = (now.slice(-4) + random); // final result: 8-digit string            

            // Add job to queue
            const job = await seoGuideQueue.add('createSeoGuide', {
                query,
                projectID: numericProjectID.toString(),
                email,
                queryID,
                queryEngine,
                language,
                hl,
                gl,
                lr
            });

            // Wait for job completion
            const result = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Job timeout'));
                }, 300000); // 5 minute timeout

                queueEvents.on('completed', async (jobData) => {
                    if (jobData.jobId === job.id) {
                        clearTimeout(timeout);
                        const completedJob = await seoGuideQueue.getJob(job.id);
                        resolve(completedJob.returnvalue);
                    }
                });

                queueEvents.on('failed', (jobData) => {
                    if (jobData.jobId === job.id) {
                        clearTimeout(timeout);
                        reject(new Error(jobData.failedReason));
                    }
                });
            });

            // Return the final result
            return new Response(JSON.stringify({
                status: "completed",
                data: result
            }), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });

        } catch (error: any) {
            console.error("POST /seo-guide error:", error);
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