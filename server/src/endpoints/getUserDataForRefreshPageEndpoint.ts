import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint } from "payload";
import { FRONTEND_URL } from "@/config/apiConfig";

export const getUserDataForRefreshPageEndpoint : Endpoint = {

    path : '/usrInfo',

    method : 'get',

    handler : withErrorHandling(async (req) : Promise<Response> => {

        const authHeader = req.headers.get('authorization');

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        };

        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
                    ...corsHeaders
                },
            });
        }

        if(!authHeader || !authHeader.startsWith('Bearer')){
            return new Response(JSON.stringify({ message: "Unauthorized" }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        }

        // ✅ Find user by email in Payload CMS
        const user = await req.payload.find({
            collection: "users",
            where: { email: { equals: req.user?.email } },
        });

        if (!user.docs.length) {
            return new Response(JSON.stringify({ message: "User not found" }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
            });
        }

        const userData = user.docs[0];

        return new Response(JSON.stringify({
            user: userData
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            },
        });
    })
}