import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const getHistoricalVolatilityEndpoint: Endpoint = {
    path: "/getHistoricalVolatility",
    method: "get",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const { category, days = "30" } = req.query;
        
        // Parse days parameter
        const daysToFetch = parseInt(days as string, 10) || 30;
        const limit = Math.min(daysToFetch, 90); // Cap at 90 days for performance
        
        // Build query
        const query: any = {};
        if (category && typeof category === 'string') {
            query.category = { equals: category };
        }
        
        // Get historical volatility scores
        const volatilityScores = await payload.find({
            collection: "serpVolatilityScores",
            where: query,
            sort: "-date",
            limit,
        });
        
        // Format data for time series
        const timeSeriesData = volatilityScores.docs.map(doc => ({
            date: doc.date,
            score: doc.score,
            scoreLevel: doc.scoreLevel,
            features: doc.features || {},
        }));
        
        return new Response(
            JSON.stringify({
                timeSeriesData,
                category: category || "All",
                days: limit,
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