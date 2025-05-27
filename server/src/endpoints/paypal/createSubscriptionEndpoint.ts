
<<<<<<< HEAD
=======
import { FRONTEND_URL } from "@/config/apiConfig";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { createSubscription } from "@/services/paypal/subscription/CreateSubscription";

import { Endpoint, PayloadRequest } from "payload";

export const paypalSubscriptionEndpoint: Endpoint = {
    path: '/create-subscription',

    method: 'post',

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
<<<<<<< HEAD
                    "Access-Control-Allow-Origin": "*",
=======
                    "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        let planID: string | undefined;

        if (req.json) {
            const body = await req.json();
            planID = body?.planId;
        }

        if (!planID) {
            return new Response(
                JSON.stringify({ error: 'Missing planID in the request body' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
<<<<<<< HEAD
                        "Access-Control-Allow-Origin": "*",
=======
                        "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                    },
                }
            );
        }

        const approvalUrl = await createSubscription(planID);

        return new Response(
            JSON.stringify({ approvalUrl }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
<<<<<<< HEAD
                    "Access-Control-Allow-Origin": "*",
=======
                    "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                },
            }
        );
    }),
};
