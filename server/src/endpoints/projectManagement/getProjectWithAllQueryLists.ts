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

interface SeoGuide {
    query: string;
    queryID: string;
    queryEngine: string;
    project: Project;
    language: string;
    gl: string;
    createdAt: string;
    createdBy: string;
    soseo: number;
    dseo: number;
    monitoringUrl: string;
}

interface User {
    id: string;
    profilePicture?: string;
}

export const getProjectWithSeoGuideList: Endpoint = {
    path: "/all-project-with-query-list",
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
            // Find all projects for the user
            const projectsRes = await payload.find({
                collection: "projects",
                where: {
                    and: [
                        {
                            user: { equals: userId }
                        },
                        {
                            "user.email": { equals: req.user?.email }
                        }
                    ]
                },
            });

            if (!projectsRes.docs.length) {
                return new Response(JSON.stringify({ guides: [] }), {
                    status: 200,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Get all SEO guides for all projects
            const seoGuides = await payload.find({
                collection: "seo-guides",
                where: {
                    project: { in: projectsRes.docs.map(project => project.id) },
                },
                depth: 2,
            });

            // Get user data for profile pictures
            const users = await payload.find({
                collection: "users",
                where: {
                    id: { in: projectsRes.docs.map(project => (project.user as any).id) },
                },
            });

            // Create a map of user IDs to usernames and profile pictures
            const userMap = new Map(
                users.docs.map(user => [user.id, { username: user.username, profilePicture: user.profilePicture }])
            );

            // Return all projects with their related SEO guides
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
                        username: userMap.get((guide.project as any)?.user?.id)?.username,
                        creatorProfilePicture: userMap.get((guide.project as any)?.user?.id)?.profilePicture,
                        soseo: guide.soseo,
                        dseo: guide.dseo,
                        monitoringUrl: guide.monitoringUrl
                    }))
                }),
                { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );

        } catch (error: any) {
            console.error("GET /api/projects error:", error);
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
