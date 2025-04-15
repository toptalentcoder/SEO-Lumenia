import { withErrorHandling } from "@/middleware/errorMiddleware";
import { calculateImprovedSerpVolatility } from "@/services/serpWeather/calculateSerpVolatility";
import { saveDailyVolatilityScores } from "@/services/serpWeather/trackKeywords";
import { Endpoint, PayloadRequest } from "payload";

export const generateKeywordsEndpoint : Endpoint = {

    path : "/generateKeywords",

    method : "get",

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        const {payload} = req;

        // const date = new Date().toISOString().split("T")[0]; // Today
        // const result = await calculateImprovedSerpVolatility(payload, date);
        await saveDailyVolatilityScores(payload);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    })
}