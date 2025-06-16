import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface FlattenedGuide {
  projectName: string;
  projectID: string;
  domainName?: string;
  query: string;
  queryID: string;
  queryEngine: string;
  language: string;
  createdAt: string;
  createdBy: string;
}

export const getProjectGuides: Endpoint = {
  path: "/get-project-guides",
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

    const email = req.query?.email;
    const projectID = req.query?.projectID;

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!projectID || typeof projectID !== "string") {
      return new Response(JSON.stringify({ error: "projectID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ✅ Step 1: Get user by email
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

    // ✅ Step 2: Get project by projectID and user ID (correct types)
    const projects = await payload.find({
      collection: "projects",
      where: {
        projectID: { equals: parseInt(projectID) },
        user: { equals: user.id },
      },
      limit: 1,
    });

    if (!projects.docs.length) {
      return new Response(
        JSON.stringify({ error: "Project not found or not owned by user" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const project = projects.docs[0];

    // ✅ Step 3: Find SEO Guides linked to the project
    const seoGuidesRes = await payload.find({
      collection: "seo-guides",
      where: {
        project: { equals: project.id }, // must match the internal ID
      },
      limit: 100,
      depth: 0,
    });

    // ✅ Step 4: Format & return
    const guides: FlattenedGuide[] = seoGuidesRes.docs.map((guide) => ({
      projectName: project.projectName,
      projectID: String(project.projectID),
      domainName: project.domainName || "",
      query: guide.query || "",
      queryID: guide.queryID || "",
      queryEngine: guide.queryEngine || "",
      language: guide.language || "",
      createdAt: guide.createdAt
        ? new Date(guide.createdAt as number).toISOString()
        : "unknown",
      createdBy: guide.createdBy || "unknown",
    }));

    guides.sort((a, b) => {
      if (a.createdAt === "unknown") return 1;
      if (b.createdAt === "unknown") return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return new Response(JSON.stringify(guides), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }),
};
