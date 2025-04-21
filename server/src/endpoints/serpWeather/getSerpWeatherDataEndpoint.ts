import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const getSerpWeatherDataEndpoint: Endpoint = {
    path: "/getSerpWeatherData",
    method: "get",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const { category } = req.query;

        // Get keywords for the specified category or all categories
        const keywordQuery: any = {};
        if (category && typeof category === 'string') {
            keywordQuery.category = { equals: category };
        }

        const keywords = await payload.find({
            collection: "serpWeatherKeywords",
            where: keywordQuery,
            limit: 100,
        });

        // Get the latest volatility scores
        const volatilityQuery: any = {};
        if (category && typeof category === 'string') {
            volatilityQuery.category = { equals: category };
        }

        const volatilityScores = await payload.find({
            collection: "serpVolatilityScores",
            where: volatilityQuery,
            sort: "-date",
            limit: 1,
        });

        return new Response(
            JSON.stringify({
                keywords: keywords.docs,
                volatilityScore: volatilityScores.docs[0] || null,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }),
}; 