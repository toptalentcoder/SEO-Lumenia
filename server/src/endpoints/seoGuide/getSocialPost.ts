import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { ProjectSocialPost } from "@/types/project";

export const getSocialPostEndpoint: Endpoint = {
    path: '/get_social_post',  // Endpoint path for retrieving social posts
    method: 'get',  // GET method to retrieve data
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        const { queryID, email } = req.query;

        // CORS headers for cross-origin requests
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        };

        if (!queryID || !email) {
            return new Response(
                JSON.stringify({ error: "Missing required parameters: queryID or email" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        try {
            // Find the user by email
            const users = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });

            if (!users.docs.length) {
                return new Response(
                    JSON.stringify({ error: `User not found for email: ${email}` }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders
                        },
                    }
                );
            }

            const user = users.docs[0];

            // Find the project with the given queryID
            const projects = user.projects as ProjectSocialPost[] | undefined;
            const project = projects?.find((project: ProjectSocialPost) =>
                project.seoGuides.some(guide => guide.queryID === queryID)
            );

            if (!project) {
                return new Response(
                    JSON.stringify({ error: `Project not found for queryID: ${queryID}` }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders
                        },
                    }
                );
            }

            // Retrieve the seoEditor data for the given queryID
            const seoGuide = project.seoGuides.find(guide => guide.queryID === queryID);
            const socialPostData = seoGuide ? seoGuide.socialPost : null;

            if (!socialPostData) {
                return new Response(
                    JSON.stringify({ error: `seoEditor data not found for queryID: ${queryID}` }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders
                        },
                    }
                );
            }

            // Return the seoEditor data as a response
            return new Response(
                JSON.stringify({ success: true, socialPostData }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        } catch (error) {
            console.error("❌ getsocialPostData error:", error);
            return new Response(
                JSON.stringify({ error: "Failed to retrieve seoEditor data" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }
    })
};
