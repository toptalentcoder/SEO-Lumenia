import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface Project {
    projectName: string;
    projectID: string;
    domainName?: string;
    createdAt?: string;
}

export const getAllUserProjects: Endpoint = {
    path: "/get-all-projects",
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
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const { email } = req.query;

        if (!email || typeof email !== "string") {
            return new Response(JSON.stringify({ error: "Email is required" }), {
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
            return new Response(JSON.stringify({ error: `❌ User not found for email: ${email}` }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        const user = users.docs[0];
        const rawProjects = user.projects as Project[];

        if (!Array.isArray(rawProjects)) {
            return new Response(
                JSON.stringify({ error: "Projects are not in the expected array format" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        const filteredProjects: Project[] = rawProjects
            .filter((p) => p.projectName !== "Default")
            .sort((a, b) => {
                const dateA = new Date(a.createdAt ?? "").getTime();
                const dateB = new Date(b.createdAt ?? "").getTime();
                return dateB - dateA;
            })
            .map(({ projectName, projectID, domainName, createdAt }) => ({
                projectName,
                projectID,
                domainName: domainName ?? '',
                createdAt: createdAt ?? '',
            }));

        return new Response(JSON.stringify(filteredProjects), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }),
};
