import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";

export const getSoseoDseoEndpoint: Endpoint = {
    path: "/get_soseo_dseo",
    method: "get",
    handler: withErrorHandling(async (req) => {
        if (!req.url) {
            return new Response(JSON.stringify({ error: "Invalid request URL" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const queryID = url.searchParams.get("queryID");

        if (!email || !queryID) {
            return new Response(JSON.stringify({ error: "Missing email or queryID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const users = await req.payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        const user = users.docs[0];
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        for (const project of Array.isArray(user.projects) ? user.projects : []) {
            const typedProject = project as { seoGuides?: { queryID: string; soseo?: number; dseo?: number }[] };
            for (const guide of typedProject.seoGuides || []) {
                if (guide.queryID === queryID) {
                return new Response(
                    JSON.stringify({ success: true, soseo: guide.soseo || 0, dseo: guide.dseo || 0 }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                );
                }
            }
        }

        return new Response(JSON.stringify({ success: true, soseo: 0, dseo: 0 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
};
