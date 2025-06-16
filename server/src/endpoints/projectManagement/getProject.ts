import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface FlattenedProjectInfo {
    projectName: string;
    projectID: string;
    query: string;
    queryID: string;
    queryEngine: string;
    language: string;
    gl: string;
    createdAt: string;
    createdBy: string;
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
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const email = req.query?.email;
        if (!email || typeof email !== "string") {
            return new Response(JSON.stringify({ error: "Email is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        // 1. Find user by email
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: `❌ User not found for email: ${email}` }),
                {
                status: 404,
                headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        const user = users.docs[0];

        // 2. Get all projects owned by this user
        const projectsRes = await payload.find({
            collection: "projects",
            where: { user: { equals: user.id } },
            limit: 100,
            depth: 0,
        });

        const allProjects = projectsRes.docs;
        if (!allProjects.length) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        const projectIDs = allProjects.map((p) => p.id);

        // 3. Get all SEO guides linked to any of those projects
        const seoGuidesRes = await payload.find({
        collection: "seo-guides",
        where: {
            project: { in: projectIDs },
        },
        limit: 1000,
        depth: 0,
        });

        const allSeoGuides = seoGuidesRes.docs;

        // 4. Flatten result
        const flattened: FlattenedProjectInfo[] = allSeoGuides.map((guide) => {
        const project = allProjects.find((p) => p.id === guide.project);

        return {
            projectName: project?.projectName ?? "Unknown",
            projectID: String(project?.projectID ?? "Unknown"),
            query: guide.query ?? "",
            queryID: guide.queryID ?? "",
            queryEngine: guide.queryEngine ?? "",
            language: guide.language ?? "unknown",
            gl: guide.gl ?? "unknown",
            createdAt: typeof guide.createdAt === "number"
            ? new Date(guide.createdAt).toISOString()
            : "unknown",
            createdBy: guide.createdBy ?? "unknown",
        };
        });

        // 5. Sort newest to oldest
        flattened.sort((a, b) => {
        if (a.createdAt === "unknown") return 1;
        if (b.createdAt === "unknown") return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return new Response(JSON.stringify(flattened), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }),
};
