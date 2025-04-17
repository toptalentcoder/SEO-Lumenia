import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";
import { internalPageRank } from "@/services/UrlPageServie/internalPageRank";

export const internalPageRankEndpoint: Endpoint = {
    path: "/internal_pagerank",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const body = req.json ? await req.json() : {};
        const { baseUrl } = body;

        if (!baseUrl) {
            return new Response(JSON.stringify({ error: "Missing baseUrl" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const existing = await payload.find({
            collection: "internalPageRanks",
            where: { baseUrl: { equals: baseUrl } },
            limit: 1,
        });

        if (existing.docs.length) {
            return new Response(
                JSON.stringify({ fromCache: true, data: existing.docs[0].scores }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        const scores = await internalPageRank(baseUrl, payload);

        await payload.create({
            collection: "internalPageRanks",
            data: {
                baseUrl,
                scores,
                lastCrawledAt: new Date().toISOString(),
            },
        });

        return new Response(
            JSON.stringify({ fromCache: false, data: scores }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
};
