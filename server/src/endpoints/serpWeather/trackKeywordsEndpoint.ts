import { withErrorHandling } from "@/middleware/errorMiddleware";
import { saveDailyVolatilityScores } from "@/services/serpWeather/trackKeywords";
import { Endpoint, PayloadRequest } from "payload";


export const trackKeywordsEndpoint: Endpoint = {
    path: "/trackKeywords",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        try {
            await saveDailyVolatilityScores(payload);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Keywords tracked and volatility scores updated successfully",
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("Error tracking keywords:", error);

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Failed to track keywords and update volatility scores",
                    error: error instanceof Error ? error.message : "Unknown error",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }
    }),
}; 