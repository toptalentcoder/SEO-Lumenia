import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const getUserProjectInfo: Endpoint = {
    path: "/getProjectItemInfo",
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

        if (!email || !projectID || typeof email !== "string" || typeof projectID !== "string") {
            return new Response(JSON.stringify({ error: "Both email and projectID are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        // // Step 1: Find the user by email
        const users = await payload.find({
          collection: "users",
          where: { email: { equals: email } },
          limit: 1,
        });

        if (!users.docs.length) {
          return new Response(JSON.stringify({ error: `❌ User not found for email: ${email}` }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const usera = users.docs[0];

        console.log(usera.id);
        console.log(req?.user?.id);

        if (!req.user || !req.user.id) {
            return new Response(JSON.stringify({ error: "Unauthorized: user not logged in" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }

        // Step 2: Find project by user ID and projectID
        const projectRes = await payload.find({
        collection: "projects",
        where: {
            user: { equals: req?.user?.id },
            projectID: { equals: parseInt(projectID, 10) },
        },
        limit: 1,
        });

        if (!projectRes.docs.length) {
        return new Response(JSON.stringify({ error: `Project not found for projectID: ${projectID}` }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
        }

        const project = projectRes.docs[0];

        // Step 3: Return project
        return new Response(
        JSON.stringify({ project }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }),
};
