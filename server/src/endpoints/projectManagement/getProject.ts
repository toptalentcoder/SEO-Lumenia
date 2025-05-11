import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface FlattenedProjectInfo {
    projectName: string;
    projectID : string;
    query: string;
    queryID: string;
    queryEngine: string;
    language: string;
    gl: string;
    createdAt: string;
}

interface Project {
    projectName?: string;
    projectID ? : string;
    seoGuides?: {
        query?: string;
        queryID?: string;
        queryEngine?: string;
        language?: string;
        gl? : string;
        createdAt?: number | string;
        createdBy?: string;
    }[];
}

export const getUserProjects: Endpoint = {
    path: "/get-projects",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
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

        const typedProjectData = projectData as Project[];

        const flattenedProjects: FlattenedProjectInfo[] = typedProjectData
            .flatMap((project) => {
                if (!Array.isArray(project.seoGuides)) return [];

                return project.seoGuides.map((guide) => ({
                    projectName: project.projectName || '',
                    projectID: project.projectID || '',
                    query: guide.query || '',
                    queryID: guide.queryID || '',
                    queryEngine: guide.queryEngine || '',
                    language: guide.language || 'unknown',
                    gl : guide.language || 'unknown',
                    createdAt:
                        typeof guide.createdAt === 'number'
                        ? new Date(guide.createdAt).toISOString()
                        : 'unknown',
                    createdBy: guide.createdBy || 'unknown',
                }));
            })
            .sort((a, b) => {
                // Push 'unknown' dates to the end
                if (a.createdAt === 'unknown') return 1;
                if (b.createdAt === 'unknown') return -1;

                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
