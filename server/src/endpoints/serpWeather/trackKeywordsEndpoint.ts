import { withErrorHandling } from "@/middleware/errorMiddleware";
import { saveDailyVolatilityScores } from "@/services/serpWeather/trackKeywords";
import { Endpoint, PayloadRequest } from "payload";

<<<<<<< HEAD
=======

>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
export const trackKeywordsEndpoint: Endpoint = {
    path: "/trackKeywords",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
<<<<<<< HEAD
        
        try {
            await saveDailyVolatilityScores(payload);
            
=======
        try {
            await saveDailyVolatilityScores(payload);

>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
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
<<<<<<< HEAD
            
=======

>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
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