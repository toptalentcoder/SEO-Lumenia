import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface Project {
    id: string;
    projectID: number;
    projectName: string;
    user: {
        id: string;
        username: string;
    };
}

export const getProjectWithQueryListsByProjectID: Endpoint = {
    path: "/all-project-with-query-list/:projectID",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
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
                return new Response(JSON.stringify({ error: "Authentication required" }), {
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

        try {
            // Get projectID from the URL path
            const url = req.url || '';
            const projectID = url.split('/').pop();

            if (!projectID) {
                return new Response(JSON.stringify({ error: "ProjectID is required" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Find project by user ID and projectID
            const projectRes = await payload.find({
                collection: "projects",
                where: {
                    user: { equals: userId },
                    projectID: { equals: parseInt(projectID, 10) },
                },
                limit: 1,
            });

            if (!projectRes.docs.length) {
                return new Response(JSON.stringify({ error: `Project not found for projectID: ${projectID}` }), {
                    status: 404,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            const project = projectRes.docs[0];

            // Get related SEO guides for this project
            const seoGuides = await payload.find({
                collection: "seo-guides",
                where: {
                    project: { equals: project.id },
                },
                depth: 2,
            });

            // Get user data for profile picture
            const users = await payload.find({
                collection: "users",
                where: {
                    id: { equals: (project.user as any).id },
                },
                limit: 1,
            });

            // Return project with related SEO guides
            return new Response(
                JSON.stringify({
                    guides: seoGuides.docs.map(guide => ({
                        query: guide.query,
                        queryID: guide.queryID,
                        queryEngine: guide.queryEngine,
                        projectName: (guide.project as any)?.projectName,
                        projectID: (guide.project as any)?.projectID,
                        language: guide.language,
                        gl: guide.gl,
                        createdAt: guide.createdAt,
                        createdBy: guide.createdBy,
                        username: users.docs[0]?.username,
                        creatorProfilePicture: users.docs[0]?.profilePicture,
                        soseo: guide.soseo,
                        dseo: guide.dseo,
                        monitoringUrl: guide.monitoringUrl
                    }))
                }),
                { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );

        } catch (error: any) {
            console.error("GET /api/project/:projectID error:", error);
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
