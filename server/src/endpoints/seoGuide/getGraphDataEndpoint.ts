<<<<<<< HEAD
// /endpoints/get_optimization_graph_data.ts
=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";

export const getOptimizationGraphDataEndpoint: Endpoint = {
    path: "/get_optimization_graph_data",
    method: "get",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { email, queryID } = req.query;

        if (!email || !queryID || typeof email !== "string" || typeof queryID !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing or invalid query parameters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const users = await req.payload.find({
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
        const projects = user.projects as { seoGuides?: { queryID: string; graphLineData?: { x: number; y: number }[] }[] }[] | undefined;
        const project = projects?.find((p) =>
            p.seoGuides?.some((guide) => guide.queryID === queryID)
        );

        const guide = project?.seoGuides?.find((g) => g.queryID === queryID) ?? null;

        return new Response(
            JSON.stringify({ success: true, graphLineData: guide?.graphLineData || [] }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
};
