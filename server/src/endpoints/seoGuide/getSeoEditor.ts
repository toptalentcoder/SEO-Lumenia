import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";
import { Endpoint } from "payload";
import { ProjectSeoGuide } from "@/types/project";

export const getSeoEditorDataEndpoint: Endpoint = {

    path: '/get_seo_editor_data',

    method: 'get',

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;
        const { queryID, email } = req.query;

        // Validate query parameters
        if (!queryID || typeof queryID !== "string" || !email || typeof email !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing or invalid queryID/email" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
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
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            const user = users.docs[0];

            // Find the project with the given queryID
            const projects = user.projects as ProjectSeoGuide[] | undefined;
            const project = projects?.find((project: ProjectSeoGuide) =>
                project.seoGuides.some(guide => guide.queryID === queryID)
            );

            if (!project) {
                return new Response(
                    JSON.stringify({ error: `Project not found for queryID: ${queryID}` }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            // Retrieve the seoEditor data for the given queryID
            const seoGuide = project.seoGuides.find(guide => guide.queryID === queryID);
            const seoEditorData = seoGuide ? seoGuide.seoEditor : null;

            if (!seoEditorData) {
                return new Response(
                    JSON.stringify({ error: `seoEditor data not found for queryID: ${queryID}` }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            // Return the seoEditor data as a response
            return new Response(
                JSON.stringify({ success: true, seoEditorData }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("❌ getSeoEditorData error:", error);
            return new Response(
                JSON.stringify({ error: "Failed to retrieve seoEditor data" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

    })
};
