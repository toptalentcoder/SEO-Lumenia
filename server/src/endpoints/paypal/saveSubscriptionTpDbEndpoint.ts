import { withErrorHandling } from "@/middleware/errorMiddleware";
import { showSubscription } from "@/services/paypal/subscription/ShowSubscription";
import { Endpoint, PayloadRequest } from "payload";
<<<<<<< HEAD
=======
import { FRONTEND_URL } from "@/config/apiConfig";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

export const saveSubscriptionToUserCollection: Endpoint = {
    path: "/save-subscription",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (req.method === "OPTIONS") {
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
<<<<<<< HEAD
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
=======
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": FRONTEND_URL || "*" },
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
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
<<<<<<< HEAD
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
=======
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": FRONTEND_URL || "*" },
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
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
<<<<<<< HEAD
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
=======
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": FRONTEND_URL || "*" },
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                    }
                );
            }

            if(matchedPlan.category === 'subscription'){
                // 🔹 Update user subscription in Payload CMS
                await payload.update({
                    collection: "users",
                    where: { email: { equals: userEmail } },
                    data: {
                        subscriptionPlan: matchedPlan.id, // 🔹 Save relation (MongoDB ObjectID)
                        paypalSubscriptionExpiresAt: nextBillingTime,
                        availableFeatures : {
                            tokens : matchedPlan.features?.subscription_features?.tokens,
                            ai_tokens : matchedPlan.features?.subscription_features?.ai_tokens,
                            seats : matchedPlan.features?.subscription_features?.seats,
                            guests : matchedPlan.features?.subscription_features?.guests,
                            monitoring : matchedPlan.features?.subscription_features?.monitoring,
                        },
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
                    },
                });
            }


            return new Response(
                JSON.stringify({ success: "Subscription updated successfully!" }),
                {
                    status: 200,
<<<<<<< HEAD
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
=======
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": FRONTEND_URL || "*" },
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                }
            );
        } catch (error) {
            console.error("❌ Error updating user subscription:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
<<<<<<< HEAD
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
=======
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": FRONTEND_URL || "*" },
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                }
            );
        }
    }),
};
