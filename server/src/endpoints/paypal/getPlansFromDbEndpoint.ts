import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { getPlansForSubscription } from "@/services/paypal/getPlansFromDbService";
import { Endpoint, PayloadRequest } from "payload";

export const getPlansFromDbEndpoint : Endpoint = {

    path : '/plans',

    method : 'get',

    handler : withErrorHandling(async(req : PayloadRequest) => {
        // Fetch the plans from your backend endpoint
        const fetchedPlans = await getPlansForSubscription(req.payload);

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        // Return the array of plans
        return new Response(
            JSON.stringify({ fetchedPlans }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
            }
        );
    })
}