import { withErrorHandling } from "@/middleware/errorMiddleware";
import { autoExpandSeoText } from "@/services/createSeoEditor/generateSeoAuto";

import { ProjectSeoGuide } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoAutoEndpoint : Endpoint = {

    path : '/generate_seo_auto',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        const { payload } = req;

        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await req.json();
        const { currentText, queryID, email } = body;

        if (!currentText) {
            return new Response(JSON.stringify({ error: "Missing or invalid currentText" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const autoText = await autoExpandSeoText( currentText);

            // const users = await payload.find({
            //     collection: "users",
            //     where: { email: { equals: email } },
            //     limit: 1,
            // });

            // if (!users.docs.length) {
            //     return new Response(
            //         JSON.stringify({ error: `User not found for email: ${email}` }),
            //         {
            //             status: 400,
            //             headers: {
            //                 "Content-Type": "application/json",
            //                 "Access-Control-Allow-Origin": "*",
            //             },
            //         }
            //     );
            // }

            // const user = users.docs[0];

            // const existingProjects: ProjectSeoGuide[] = Array.isArray(user.projects)
            //     ? (user.projects as ProjectSeoGuide[])
            //     : [];

            // let projectUpdated = false;
            // const updatedProjects = existingProjects.map((project) => {
            //     if (project.seoGuides.some(guide => guide.queryID === queryID)) {
            //         projectUpdated = true;
            //         return {
            //             ...project,
            //             seoGuides: project.seoGuides.map(guide =>
            //                 guide.queryID === queryID
            //                     ? {
            //                         ...guide,
            //                         seoEditor: autoText, // Join questions into a single string
            //                     }
            //                     : guide
            //             ),
            //         };
            //     }
            //     return project;
            // });

            // if (!projectUpdated) {
            //     return new Response(
            //         JSON.stringify({ error: "Project not found" }),
            //         { status: 404, headers: { "Content-Type": "application/json" } }
            //     );
            // }

            // await payload.update({
            //     collection: "users",
            //     where: { email: { equals: email } },
            //     data: { projects: updatedProjects },
            // });

            return new Response(JSON.stringify({ success: true, autoText }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
                console.error("❌ autoText error:", error);
                return new Response(JSON.stringify({ error: "Failed to generate currentText" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

    })
}