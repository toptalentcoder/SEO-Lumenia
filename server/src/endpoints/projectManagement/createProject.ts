import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

const generateProjectId = () => {
    const randomID = Math.floor(100000 + Math.random() * 900000);
    return randomID;
};

export const addProjectToUser: Endpoint = {
    path: "/project",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
    
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

        // Check if user is logged in
        if (req.user) {
            userId = req.user.id;
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
        }
    
        try {
            const body = typeof req.json === "function" ? await req.json() : {};
            const { projectName, domainName } = body;
    
            if (!projectName || !domainName) {
                return new Response(JSON.stringify({ error: "Missing required fields: projectName and domainName" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Generate project ID
            const projectID = generateProjectId();
    
            // Check for existing project with same projectID
            const existing = await payload.find({
                collection: "projects",
                where: {
                    user: { equals: userId },
                    projectID: { equals: projectID },
                },
                limit: 1,
            });
    
            if (existing.docs.length > 0) {
                return new Response(JSON.stringify({ error: "Project with this ID already exists" }), {
                    status: 409,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
    
            // Create new project
            const newProject = await payload.create({
                collection: "projects",
                data: {
                    user: userId,
                    projectID: projectID,
                    projectName,
                    domainName,
                    createdAt: new Date().toISOString(),
                },
            });
    
            // Return only the project information we want
            return new Response(JSON.stringify({
                projectName: newProject.projectName,
                projectID: newProject.projectID,
                domainName: newProject.domainName,
                createdAt: newProject.createdAt,
            }), {
                status: 201,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
    
        } catch (error: any) {
            console.error("POST /project error:", error);
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
