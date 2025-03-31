import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface ProjectSummary {
    projectName: string;
    projectID: string;
}

export const getUserProjectList: Endpoint = {
    path: "/getProjectList",
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
        if (!Array.isArray(user.projects)) {
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

        const projectSummaries: ProjectSummary[] = (user.projects as { projectName?: string; projectID?: string }[]).map((project) => ({
            projectName: project.projectName || '',
            projectID: project.projectID || '',
        }));

        return new Response(JSON.stringify(projectSummaries), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    }),
};
