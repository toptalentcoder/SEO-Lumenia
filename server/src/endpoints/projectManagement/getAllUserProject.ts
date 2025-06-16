import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const getAllUserProjects: Endpoint = {
  path: "/get-all-projects",
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
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 🔍 Get user by email
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

    // 📦 Fetch projects owned by this user
    const projectsResult = await payload.find({
      collection: "projects",
      where: {
        user: { equals: user.id },
      },
      sort: "-createdAt",
      limit: 100,
    });

    // 🧹 Normalize for response
    const cleaned = projectsResult.docs.map((p) => ({
      projectName: p.projectName,
      projectID: p.projectID,
      domainName: p.domainName ?? "",
      createdAt: p.createdAt ?? "",
    }));

    return new Response(JSON.stringify(cleaned), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }),
};
