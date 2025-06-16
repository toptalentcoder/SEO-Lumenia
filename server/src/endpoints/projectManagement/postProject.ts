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
        console.log("🔵 Starting project creation handler");
        const { payload } = req;
    
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };
    
        if (req.method === "OPTIONS") {
            console.log("🔵 Handling OPTIONS request");
            return new Response(null, { status: 204, headers: corsHeaders });
        }
    
        try {
            console.log("🔵 Parsing request body");
            const body = typeof req.json === "function" ? await req.json() : {};
            console.log("🔵 Request body:", body);
            
            const { email, projectName, domainName } = body;
    
            if (!email || !projectName || !domainName) {
                console.log("🔴 Missing required fields:", { email, projectName, domainName });
                return new Response(JSON.stringify({ error: "Missing required fields" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Generate project ID
            const projectID = generateProjectId();
            console.log("🔵 Generated projectID:", projectID);
    
            // Find user by email
            console.log("🔵 Finding user by email:", email);
            const users = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });
    
            if (!users.docs.length) {
                console.log("🔴 User not found for email:", email);
                return new Response(JSON.stringify({ error: `❌ User not found for email: ${email}` }), {
                    status: 404,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
    
            const user = users.docs[0];
            console.log("🔵 Found user:", { id: user.id, email: user.email });
    
            // Check for existing project with same projectID
            console.log("🔵 Checking for existing project");
            const existing = await payload.find({
                collection: "projects",
                where: {
                    user: { equals: user.id },
                    projectID: { equals: projectID },
                },
                limit: 1,
            });
    
            if (existing.docs.length > 0) {
                console.log("🔴 Project already exists with ID:", projectID);
                return new Response(JSON.stringify({ error: "⚠️ Project with this ID already exists" }), {
                    status: 409,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
    
            // Prepare project data
            const projectData = {
                user: user.id,
                projectID: projectID,
                projectName,
                domainName,
                createdAt: new Date().toISOString(),
            };
            
            console.log("🔵 Creating project with data:", projectData);
    
            // Create new project with required fields
            const newProject = await payload.create({
                collection: "projects",
                data: projectData,
            });
    
            console.log("✅ Project created successfully:", newProject);
    
            return new Response(JSON.stringify({ 
                project: {
                    projectName: newProject.projectName,
                    projectID: newProject.projectID,
                    domainName: newProject.domainName,
                    createdAt: newProject.createdAt,
                }
            }), {
                status: 201,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
    
        } catch (error: any) {
            console.error("🔴 POST /project error:", error);
            // Log the full error details
            if (error.stack) {
                console.error("Error stack:", error.stack);
            }
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
