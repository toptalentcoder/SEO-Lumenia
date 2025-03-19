import { withErrorHandling } from "@/middleware/errorMiddleware";
import { showSubscription } from "@/services/paypal/subscription/ShowSubscription";
import { Endpoint, PayloadRequest } from "payload";

export const showSubscriptionEndpoint: Endpoint = {
    path: "/show-subscription",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        try {
        const subscriptionId = req.query?.subscriptionId as string | undefined; // ✅ Get from query params

        if (!subscriptionId) {
            return new Response(JSON.stringify({ error: "Missing subscriptionId" }), {
            status: 400,
            });
        }

        const response = await showSubscription(subscriptionId);

        if (typeof response === "string") {
            return new Response(JSON.stringify({ error: response }), { status: 400 });
        }

        return new Response(
            JSON.stringify({ subscriptionStatus: response.subscriptionStatus }),
            { status: 200 }
        );
        } catch (error) {
        console.error("Error fetching subscription:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
        }
    }),
};
