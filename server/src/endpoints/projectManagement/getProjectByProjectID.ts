import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface FlattenedGuide {
    projectName: string;
    projectID: string;
    domainName ? : string;
    query: string;
    queryID: string;
    queryEngine: string;
    language: string;
    createdAt: string;
    createdBy: string;
}

interface Project {
    projectName?: string;
    projectID?: string;
    domainName ? : string;
    seoGuides?: {
        query?: string;
        queryID?: string;
        queryEngine?: string;
        language?: string;
        createdAt?: number | string;
        createdBy?: string;
    }[];
}

export const getProjectGuides: Endpoint = {
    path: "/get-project-guides",
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
                headers: corsHeaders,
            });
        }

        const { email, projectID } = req.query;

        if (!email || typeof email !== "string") {
            return new Response(JSON.stringify({ error: "Email is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        if (!projectID || typeof projectID !== "string") {
            return new Response(JSON.stringify({ error: "projectID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
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
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        const user = users.docs[0];
        const projects = user.projects as Project[];

        const selectedProject = projects.find((p) => p.projectID === projectID);

        if (!selectedProject) {
            return new Response(
                JSON.stringify({ error: "Project not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        // If there are no SEO guides, return project info with empty guides array
        if (!selectedProject.seoGuides || selectedProject.seoGuides.length === 0) {
            return new Response(
                JSON.stringify([{
                    projectName: selectedProject.projectName || '',
                    projectID: selectedProject.projectID || '',
                    domainName: selectedProject.domainName || '',
                    query: '',
                    queryID: '',
                    queryEngine: '',
                    language: '',
                    createdAt: '',
                    createdBy: ''
                }]),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        const guides: FlattenedGuide[] = (selectedProject.seoGuides || []).map((guide) => ({
            projectName: selectedProject.projectName || '',
            projectID: selectedProject.projectID || '',
            domainName : selectedProject.domainName || '',
            query: guide.query || '',
            queryID: guide.queryID || '',
            queryEngine: guide.queryEngine || '',
            language: guide.language || '',
            createdAt:
                typeof guide.createdAt === 'number'
                    ? new Date(guide.createdAt).toISOString()
                    : '',
            createdBy: guide.createdBy || '',        
        })).sort((a, b) => {
            if (a.createdAt === 'unknown') return 1;
            if (b.createdAt === 'unknown') return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return new Response(JSON.stringify(guides), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }),
};
