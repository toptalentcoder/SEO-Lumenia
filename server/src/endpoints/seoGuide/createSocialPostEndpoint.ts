import { withErrorHandling } from "@/middleware/errorMiddleware";
import { createSocialPost } from "@/services/createSocialPost/createSocialPost";
import { ProjectSocialPost } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";

export const createSocialPostEndpoint : Endpoint = {

    path : '/create_social_post',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        const { payload } = req;

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // You can replace '*' with specific domains for security reasons
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        };

        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            )
        }

        const body = await req.json();

        const { query, tone, platform, content, queryID, email, language } = body;

        if(!query || !tone || !platform || !content){
            return new Response(JSON.stringify({ error: "Missing or invalid query/keywords" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            }
        );}

        try {
            const socialPost = await createSocialPost({ query, tone, platform, content, language });
            const newSocialPost = [socialPost];  // Wrapping the socialPost object in an array

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
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
            }

            const user = users.docs[0];

            const existingProjects: ProjectSocialPost[] = Array.isArray(user.projects)
                ? (user.projects as ProjectSocialPost[])
                : [];

            let projectUpdated = false;
            const updatedProjects = existingProjects.map((project) => {
                if (Array.isArray(project.seoGuides) ? project.seoGuides.some(guide => guide.queryID === queryID) : null) {
                    projectUpdated = true;
                    return {
                        ...project,
                        seoGuides: project.seoGuides.map(guide =>
                            guide.queryID === queryID
                                ? {
                                    ...guide,
                                    // Ensure socialPost is always an array before updating
                                    socialPost: Array.isArray(guide.socialPost)
                                        ? [...guide.socialPost, ...newSocialPost] // Append the new social post
                                        : [...newSocialPost], // If not an array, initialize it as an array
                                }
                                : guide
                        ),
                    };
                }
                return project;
            });
            if (!projectUpdated) {
                return new Response(
                    JSON.stringify({ error: "Project not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(JSON.stringify({ success: true, socialPost }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        } catch (error) {
            console.error("❌ generateSeosocialPost error:", error);
            return new Response(JSON.stringify({ error: "Failed to generate SEO socialPost" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        }
    })
}