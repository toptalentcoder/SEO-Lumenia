import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { FRONTEND_URL } from "@/config/apiConfig";

export const deleteProject: Endpoint = {
    path: "/project/:projectID",
    method: "delete",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        let userId: string;

        // Check if user is logged in
        if (req.user) {
            userId = String(req.user.id);
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

            userId = String(users.docs[0].id);
        }

        // Get projectID from the URL path
        const projectID = req.url ? new URL(req.url).pathname.split('/').pop() : null;

        if (!projectID) {
            return new Response(JSON.stringify({ error: "ProjectID is required" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        // Validate projectID is a number
        if (isNaN(Number(projectID))) {
            return new Response(JSON.stringify({ error: "ProjectID must be a number" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        try {
            // Find the project by projectID and user
            const projects = await payload.find({
                collection: "projects",
                where: {
                    projectID: {
                        equals: Number(projectID),
                    },
                    user: {
                        equals: userId,
                    },
                },
                limit: 1,
            });

            if (!projects.docs.length) {
                return new Response(JSON.stringify({ error: "Project not found or not owned by user" }), {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                });
            }

            const project = projects.docs[0];

            // Delete the project document
            await payload.delete({
                collection: "projects",
                id: project.id,
            });

            return new Response(JSON.stringify({ 
                success: true,
                message: "Project deleted successfully" 
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        } catch (error) {
            console.error("Error deleting project:", error);
            return new Response(JSON.stringify({ error: "Failed to delete project" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }
    }),
};
