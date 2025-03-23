import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const getSeoGuideByQueryID: Endpoint = {

    path: "/getSeoGuideByQueryID",
    method: "get",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
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

        const { email, queryID } = req.query;

        if (!email || !queryID) {
            return new Response(
                JSON.stringify({ error: "Both email and queryID are required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        const users = await req.payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: `User not found for email: ${email}` }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
        );
        }

        const user = users.docs[0];

        // Look through projects to find matching queryID
        let foundGuide = null;

        if (Array.isArray(user.projects)) {

            type Project = {
                projectID: string;
                projectName: string;
                domainName?: string;
                seoGuides: { queryID: string }[];
            };

            for (const project of user.projects as Project[]) {
                if (project && Array.isArray(project.seoGuides)) {
                    const guide = project.seoGuides.find((g) => g.queryID === queryID);

                    if (guide) {

                        foundGuide = {
                            projectID: project.projectID,
                            projectName: project.projectName,
                            domainName: project.domainName || null,
                            ...guide,
                        };

                        break;
                    }
                }
            }
        }

        if (!foundGuide) {
            return new Response(
                JSON.stringify({ error: `SEO Guide not found for queryID: ${queryID}` }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }

        return new Response(JSON.stringify(foundGuide), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    }),
};
