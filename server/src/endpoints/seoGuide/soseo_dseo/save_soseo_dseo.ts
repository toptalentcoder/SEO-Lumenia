import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";

export const saveSoseoDseoEndpoint: Endpoint = {
    path: "/save_soseo_dseo",
    method: "post",
    handler: withErrorHandling(async (req) => {
        const { payload } = req;
        const body = req.json ? await req.json() : {};

        const { email, queryID, soseo, dseo } = body;

        if (!email || !queryID) {
            return new Response(JSON.stringify({ error: "Missing email or queryID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        const user = users?.docs?.[0];
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const updatedProjects = (Array.isArray(user.projects) ? user.projects : []).map((project) => {
            return typeof project === "object" && project !== null
                ? {
                    ...project,
                    seoGuides: ((project as { seoGuides?: { queryID: string }[] }).seoGuides || []).map((guide) => {
                        if (guide.queryID === queryID) {
                            return { ...guide, soseo, dseo };
                        }
                        return guide;
                    }),
                }
                : project;
        });

        await payload.update({
            collection: "users",
            where: { email: { equals: email } },
            data: { projects: updatedProjects },
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
};
