// /endpoints/save_optimization_graph_data.ts
import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";

export const saveOptimizationGraphDataEndpoint: Endpoint = {
    path: "/save_optimization_graph_data",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const body = req.json ? await req.json() : {};
        const { email, queryID, graphLineData } = body;

        if (!email || !queryID || !Array.isArray(graphLineData)) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid parameters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = users.docs[0];
        const updatedProjects = (user.projects as { seoGuides: { queryID: string; graphLineData: { x: number; y: number }[] }[] }[] | undefined)?.map((project) => {
            return {
                ...project,
                seoGuides: project.seoGuides.map((guide) =>
                guide.queryID === queryID
                    ? {
                        ...guide,
                        graphLineData,
                    }
                    : guide
                ),
            };
        });

        if (!updatedProjects) {
            return new Response(JSON.stringify({ error: "User projects not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

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
