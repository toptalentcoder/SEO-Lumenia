<<<<<<< HEAD
=======
import { FRONTEND_URL } from "@/config/apiConfig";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { Endpoint } from "payload";
import { PayloadRequest } from "payload";

export const setMonitoringUrl: Endpoint = {
  path: "/setMonitoringUrl",
  method: "post",
  handler: async (req: PayloadRequest): Promise<Response> => {
    const corsHeaders = {
<<<<<<< HEAD
      "Access-Control-Allow-Origin": "*",
=======
      "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
      "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };

    try {
      const body = req.json ? await req.json() : {};
      const { payload } = req;
      const { email, queryID, url } = body;

      if (!email || !queryID || !url) {
        return new Response(
          JSON.stringify({ error: "Missing email, queryID, or url" }),
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

      const updatedProjects = (Array.isArray(user.projects) ? user.projects : [])?.map((project: any) => {
        const updatedSeoGuides = project.seoGuides?.map((guide: { queryID: string; monitoringUrl?: string }) => {
          if (guide.queryID === queryID) {
            return { ...guide, monitoringUrl: url };
          }
          return guide;
        });

        return { ...project, seoGuides: updatedSeoGuides };
      }) || [];

      await payload.update({
        collection: "users",
        id: user.id,
        data: { projects: updatedProjects },
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err) {
      console.error("❌ setMonitoringUrl error:", err);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
