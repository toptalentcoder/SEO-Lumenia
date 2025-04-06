import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { ProjectSeoGuide } from "@/types/project";

export const saveSeoEditorDataEndpoint: Endpoint = {
    path: "/save_seo_editor_data",
    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        const body = await req.json();
        const { queryID, email, content } = body;

        if (!queryID || !email || !content) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: queryID, email, or content" }),
                { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        try {
            const users = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });

            if (!users.docs.length) {
                return new Response(
                    JSON.stringify({ error: `User not found for email: ${email}` }),
                    { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
                );
            }

            const user = users.docs[0];

            const updatedProjects: ProjectSeoGuide[] = (Array.isArray(user.projects) ? user.projects as ProjectSeoGuide[] : []).map((project: ProjectSeoGuide) => {
                const updatedGuides = (project.seoGuides || []).map(guide => {
                    if (guide.queryID === queryID) {
                        return { ...guide, seoEditor: content }; // ✅ overwrite
                    }
                    return guide;
                });

                return { ...project, seoGuides: updatedGuides };
            });

            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        } catch (err) {
            console.error("❌ Failed to save editor content:", err);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }
    }),
};
