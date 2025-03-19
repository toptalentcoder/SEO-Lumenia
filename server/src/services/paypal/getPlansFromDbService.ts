import { API_KEY, BASE_URL } from "@/config/apiConfig";
import axios from "axios";
import { Payload } from "payload";

interface SubscriptionFeatures {
    subscription_features : {
        tokens?: number;
        ai_tokens?: number;
        seats?: number;
        guests?: number;
        monitoring?: number;
    }
}

interface ApiFeatures {
    api_features : {
        parallel_generation?: number;
        api_rate_limit?: number;
    }
}

interface Plan {
    plan_name: string;
    month_plan_id: string;
    year_plan_id: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    currency: string;
    category: string; // "subscription" or "api"
    features?: SubscriptionFeatures | ApiFeatures;
}

export const getPlansForSubscription = async (
    payload: Payload,
    order: "asc" | "desc" = "asc"
): Promise<{ subscriptionPlans: Plan[], apiPlans: Plan[] }> => {
    if (!API_KEY || !BASE_URL) {
        throw new Error("API_KEY or BASE_URL is missing in environment variables.");
    }

    try {
        const sortOrder = order === "asc" ? "monthly_price" : "-monthly_price"; // Sorting order

        // Fetch all plans without filtering by category
        const response = await payload.find({
            collection: "billing_plan",
            sort: sortOrder, // ✅ Sorting by `monthly_price`
            limit: 50 // Limit results if needed
        });

        const fetchedPlans = response.docs || []; // ✅ Ensures an array is always returned

        // Filter plans by category
        const subscriptionPlans = fetchedPlans.filter((plan) => plan.category === "subscription").map((plan) => {
            return {
                plan_name: plan.plan_name ?? "",
                month_plan_id: plan.month_plan_id ?? "",
                year_plan_id: plan.year_plan_id ?? "",
                description: plan.description ?? "",
                monthly_price: plan.monthly_price ?? 0,
                yearly_price: plan.yearly_price ?? 0,
                currency: plan.currency ?? "",
                category: plan.category ?? "",
                features: {
                    subscription_features : {
                        tokens: plan.features?.subscription_features?.tokens ?? 0,
                        ai_tokens: plan.features?.subscription_features?.ai_tokens ?? 0,
                        seats: plan.features?.subscription_features?.seats ?? 0,
                        guests: plan.features?.subscription_features?.guests ?? 0,
                        monitoring: plan.features?.subscription_features?.monitoring ?? 0,
                    }
                }
            };
        });

        const apiPlans = fetchedPlans.filter((plan) => plan.category === "api").map((plan) => {
            return {
                plan_name: plan.plan_name ?? "",
                month_plan_id: plan.month_plan_id ?? "",
                year_plan_id: plan.year_plan_id ?? "",
                description: plan.description ?? "",
                monthly_price: plan.monthly_price ?? 0,
                yearly_price: plan.yearly_price ?? 0,
                currency: plan.currency ?? "",
                category: plan.category ?? "",
                features: {
                    api_features : {
                        parallel_generation: plan.features?.api_features?.parallel_generation ?? 0,
                        api_rate_limit: plan.features?.api_features?.api_rate_limit ?? 0,
                    }
                }
            };
        });

        // Return both subscription and API plans
        return { subscriptionPlans, apiPlans };

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.status, error.response?.data || error.message);
        } else {
            console.error("Error fetching plans:", error instanceof Error ? error.message : error);
        }

        throw new Error("Failed to fetch plans from the server.");
    }
};
