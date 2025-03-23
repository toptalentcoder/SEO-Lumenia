import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface FlattenedProjectInfo {
    projectName: string;
    query: string;
    queryID: string;
    queryEngine: string;
    language: string;
    createdAt: string;
}

interface Project {
    projectName?: string;
    seoGuides?: {
        query?: string;
        queryID?: string;
        queryEngine?: string;
        language?: string;
        createdAt?: number | string;
    }[];
}

export const getUserProjects: Endpoint = {
    path: "/get-projects",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                ...corsHeaders,
                },
            });
        }

        const { email } = req.query;

        if (!email || typeof email !== "string") {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: `❌ User not found for email: ${email}` }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        const user = users.docs[0];
        const projectData = user.projects;

        if (!Array.isArray(projectData)) {
            return new Response(
                JSON.stringify({ error: "User projects are not in expected format" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }



        const flattenedProjects: FlattenedProjectInfo[] = (projectData as Project[]).map((project: Project) => {
            const firstGuide = Array.isArray(project.seoGuides) && project.seoGuides.length > 0
                ? project.seoGuides[0]
                : {};

            return {
                projectName: project.projectName || '',
                query: firstGuide.query || '',
                queryID: firstGuide.queryID || '',
                queryEngine: firstGuide.queryEngine || '',
                language: firstGuide.language || 'unknown',
                createdAt: typeof firstGuide.createdAt === 'number'
                    ? new Date(firstGuide.createdAt).toISOString()
                    : 'unknown'
            };
        });

        return new Response(JSON.stringify(flattenedProjects), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    }),
};
