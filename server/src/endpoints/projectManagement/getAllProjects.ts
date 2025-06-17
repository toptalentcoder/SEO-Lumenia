import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const getAllUserProjects: Endpoint = {
  path: "/project",
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

    let userId: string;

    // Check if user is logged in
    if (req.user) {
      userId = req.user.id;
    } else {
      // For non-logged-in users, check API key
      const authHeader = req.headers.get('Authorization');
      const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API key is required for non-logged-in users" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Find user by API key
      const users = await payload.find({
        collection: "users",
        where: { apiKey: { equals: apiKey } },
        limit: 1,
      });

      if (!users.docs.length) {
        return new Response(JSON.stringify({ error: "Invalid API key" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      userId = users.docs[0].id;
    }

    // Fetch projects for the user
    const projectsResult = await payload.find({
      collection: "projects",
      where: {
        user: { equals: userId },
      },
      sort: "-createdAt",
      limit: 100,
    });

    // Transform the response to only include project information
    const projects = projectsResult.docs.map(project => ({
      projectName: project.projectName,
      projectID: project.projectID,
      domainName: project.domainName,
      createdAt: project.createdAt,
    }));

    console.log(projects)

    // Return only the projects array
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }),
};
