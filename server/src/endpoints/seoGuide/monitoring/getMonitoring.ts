import { Endpoint } from "payload";
import { PayloadRequest } from "payload";

interface Project {
    seoGuides?: { queryID: string; monitoringUrl?: string }[];
  }

export const getMonitoringUrl: Endpoint = {
  path: "/getMonitoringUrl",
  method: "get",
  handler: async (req: PayloadRequest): Promise<Response> => {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };

    try {
      const { payload } = req;
      const { email, queryID } = req.query;

      if (!email || !queryID) {
        return new Response(
          JSON.stringify({ error: "Missing email or queryID" }),
          { status: 400, headers: corsHeaders }
        );
      }

      const users = await payload.find({
        collection: "users",
        where: { email: { equals: email } },
        limit: 1,
      });

      const user = users.docs[0];
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: corsHeaders,
        });
      }

      const projects = Array.isArray(user.projects) ? user.projects : [];


      const seoGuides = (projects as Project[]).flatMap((p: Project) => p.seoGuides || []);
      const guide = seoGuides?.find((g: { queryID: string; monitoringUrl?: string }) => g.queryID === queryID);

      if (!guide?.monitoringUrl) {
        return new Response(JSON.stringify({ monitoringUrl: null }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify({ monitoringUrl: guide.monitoringUrl }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err) {
      console.error("❌ getMonitoringUrl error:", err);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
