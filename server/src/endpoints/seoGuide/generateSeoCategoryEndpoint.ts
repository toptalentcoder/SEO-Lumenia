import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoCategory } from "@/services/createSeoEditor/generateSeoCategory";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoCategoryEndpoint : Endpoint = {

    path : '/generate_seo_category',

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
        const { content, email, queryID } = body;

        if(!content || typeof content !== "string") {
            return new Response(JSON.stringify({ error: "Missing or invalid content" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        }

        try{
            const categoryResponse = await generateSeoCategory({ seoContent: content });

            const categoryJson = await categoryResponse.json();

            const category = categoryJson.categories;

            // Find user
            const users = await payload.find({
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
            const existingProjects: { seoGuides?: { queryID: string }[] }[] = Array.isArray(user.projects) ? user.projects as { seoGuides?: { queryID: string }[] }[] : [];

            let projectUpdated = false;

            const updatedProjects = existingProjects.map((project: { seoGuides?: { queryID: string }[] }) => {
                if (
                    Array.isArray(project.seoGuides) &&
                    project.seoGuides.some((guide) => guide.queryID === queryID)
                ) {
                    projectUpdated = true;
                    return {
                        ...project,
                        seoGuides: project.seoGuides.map((guide) =>
                            guide.queryID === queryID
                            ? {
                                ...guide,
                                category, // 👈 Save the category here
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
                    {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                    }
                );
            }

            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(JSON.stringify({ success: true, category }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        }catch (error) {
            console.error("❌ generateWebpageTitleMeta error:", error);
            return new Response(JSON.stringify({ error: "Failed to generate SEO outlines" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        }
    })
}