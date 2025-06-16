import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { FRONTEND_URL } from "@/config/apiConfig";

export const deleteProject: Endpoint = {
    path: "/delete-project",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        if (!req.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        const body = typeof req.json === "function" ? await req.json() : {};
        const { projectID } = body;

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

        const { payload } = req;

        try {
            // Find the project by projectID and user
            const projects = await payload.find({
                collection: "projects",
                where: {
                    projectID: {
                        equals: Number(projectID),
                    },
                    user: {
                        equals: req.user.id,
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
