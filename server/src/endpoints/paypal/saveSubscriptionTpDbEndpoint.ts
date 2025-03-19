import { withErrorHandling } from "@/middleware/errorMiddleware";
import { showSubscription } from "@/services/paypal/subscription/ShowSubscription";
import { Endpoint, PayloadRequest } from "payload";
import crypto from "crypto";

// Define a flexible structure for dynamic plan features
interface DynamicFeatures {
    [key: string]: number;
}

export const saveSubscriptionToUserCollection: Endpoint = {
    path: "/save-subscription",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        let planId: string | undefined;
        let subscriptionId: string | undefined;
        let userEmail: string | undefined;
        let nextBillingTime: string | undefined;

        if (req.json) {
            const body = await req.json();
            planId = body?.planId;
            subscriptionId = body?.subscriptionId;
            userEmail = body?.userEmail;
        }

        if (!planId || !subscriptionId || !userEmail) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: planId, subscriptionId, or userEmail" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                }
            );
        }

        try {
            if (subscriptionId) {
                const subscriptionResponse = await showSubscription(subscriptionId);
                if (typeof subscriptionResponse !== "string") {
                    nextBillingTime = subscriptionResponse?.nextBillingTime;
                }
            }

            // 🔹 Fetch plan details from Payload CMS using either `month_plan_id` or `year_plan_id`
            const planData = await payload.find({
                collection: "billing_plan",
                where: {
                    or: [
                        { month_plan_id: { equals: planId } },
                        { year_plan_id: { equals: planId } },
                    ],
                },
            });

            if (!planData.docs.length) {
                return new Response(
                    JSON.stringify({ error: "Plan not found in database" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    }
                );
            }

            // 🔹 Extract the correct plan from retrieved documents
            const matchedPlan = planData.docs[0];

            if (!matchedPlan) {
                return new Response(
                    JSON.stringify({ error: "Plan features not found in database" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    }
                );
            }

            // 🔹 Ensure features exist dynamically
            // const selectedFeatures: DynamicFeatures = Object.fromEntries(
            //     Object.entries(matchedPlan.features || {}).filter(([_, value]) => value !== null).map(([key, value]) => [key, value as number])
            // );

            if(matchedPlan.category === 'subscription'){
                // 🔹 Update user subscription in Payload CMS
                await payload.update({
                    collection: "users",
                    where: { email: { equals: userEmail } },
                    data: {
                        subscriptionPlan: matchedPlan.id, // 🔹 Save relation (MongoDB ObjectID)
                        paypalSubscriptionExpiresAt: nextBillingTime,
                        // usedFeatures: Object.keys(selectedFeatures).reduce((acc, key) => {
                        //     acc[key] = 0;
                        //     return acc;
                        // }, {} as DynamicFeatures),
                    },
                });
            }else if(matchedPlan.category === 'api'){
                // 🔹 Update user subscription in Payload CMS
                await payload.update({
                    collection: "users",
                    where: { email: { equals: userEmail } },
                    data: {
                        apiPlan: matchedPlan.id, // 🔹 Save relation (MongoDB ObjectID)
                        paypalSubscriptionExpiresAt: nextBillingTime,
                        // usedFeatures: Object.keys(selectedFeatures).reduce((acc, key) => {
                        //     acc[key] = 0;
                        //     return acc;
                        // }, {} as DynamicFeatures),
                    },
                });
            }


            return new Response(
                JSON.stringify({ success: "Subscription updated successfully!" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                }
            );
        } catch (error) {
            console.error("❌ Error updating user subscription:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                }
            );
        }
    }),
};
