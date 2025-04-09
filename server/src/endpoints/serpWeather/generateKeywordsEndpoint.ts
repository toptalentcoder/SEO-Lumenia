import { withErrorHandling } from "@/middleware/errorMiddleware";
import { saveKeywordsForSERPWeatherCategory } from "@/services/serpWeather/saveKeywordsToDB";
import { Endpoint, PayloadRequest } from "payload";

export const generateKeywordsEndpoint : Endpoint = {

    path : "/generateKeywords",

    method : "get",

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        const {payload} = req;

        await saveKeywordsForSERPWeatherCategory(payload);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    })
}