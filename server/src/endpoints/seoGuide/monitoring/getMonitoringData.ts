<<<<<<< HEAD
=======
import { FRONTEND_URL } from "@/config/apiConfig";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { Endpoint } from "payload";
import { PayloadRequest } from "payload";

interface Project {
    projectID: string;
    projectName: string;
    seoGuides?: {
        query: string;
        queryID: string;
        monitoringUrl?: string;
        cronjob?: {
            [url: string]: { date: string; position: number }[];
        };
    }[];
}

export const getMonitoringData: Endpoint = {
    path: "/getMonitoringData",
    method: "get",
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
            const { payload } = req;
            const { email } = req.query;

            if (!email) {
                return new Response(JSON.stringify({ error: "Missing email" }), {
                    status: 400,
                    headers: corsHeaders,
                });
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

            const result = (projects as Project[]).map((project) => {
                return {
                    projectID: project.projectID,
                    projectName: project.projectName,
                    guides: (project.seoGuides || [])
                        .filter(g => g.monitoringUrl && g.cronjob?.[g.monitoringUrl])
                        .map((g) => ({
                            query: g.query,
                            queryID: g.queryID,
                            monitoringUrl: g.monitoringUrl,
                            positions: g.cronjob?.[g.monitoringUrl!] || []
                        }))
                };
            });

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: corsHeaders,
            });

        } catch (err) {
            console.error("❌ getMonitoringData error:", err);
            return new Response(JSON.stringify({ error: "Server error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};
