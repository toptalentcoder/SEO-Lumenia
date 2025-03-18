import { API_KEY, BASE_URL } from "@/config/apiConfig";
import axios from "axios";
import { Payload } from "payload";

interface SubscriptionFeatures {
    tokens?: number;
    ai_tokens?: number;
    seats?: number;
    guests?: number;
    monitoring?: number;
}

interface ApiFeatures {
    parallel_generation?: number;
    api_rate_limit?: number;
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
    category: "subscription" | "api",
    order: "asc" | "desc" = "asc"
): Promise<Plan[]> => {
    if (!API_KEY || !BASE_URL) {
        throw new Error("API_KEY or BASE_URL is missing in environment variables.");
    }

    try {
        const sortOrder = order === "asc" ? "monthly_price" : "-monthly_price"; // Sorting order

        // Fetch plans with filtering by category
        const response = await payload.find({
            collection: "billing_plan",
            where: {
                category: {
                    equals: category
                }
            },
            sort: sortOrder, // ✅ Sorting by `monthly_price`
            limit: 50 // Limit results if needed
        });

        const fetchedPlans = response.docs || []; // ✅ Ensures an array is always returned

        // Process and return the structured plan data
        return fetchedPlans.map((plan) => {
            const structuredPlan: Plan = {
                plan_name: plan.plan_name ?? "",
                month_plan_id: plan.month_plan_id ?? "",
                year_plan_id: plan.year_plan_id ?? "",
                description: plan.description ?? "",
                monthly_price: plan.monthly_price ?? 0,
                yearly_price: plan.yearly_price ?? 0,
                currency: plan.currency ?? "",
                category: plan.category ?? "", // Ensure category is included in the returned plan
            };

            // Assign features based on the category
            if (plan.category === "subscription") {
                structuredPlan.features = {
                    tokens: plan.features?.subscription_features?.tokens ?? 0,
                    ai_tokens: plan.features?.subscription_features?.ai_tokens ?? 0,
                    seats: plan.features?.subscription_features?.seats ?? 0,
                    guests: plan.features?.subscription_features?.guests ?? 0,
                    monitoring: plan.features?.subscription_features?.monitoring ?? 0,
                };
            } else if (plan.category === "api") {
                structuredPlan.features = {
                    parallel_generation: plan.features?.api_features?.parallel_generation ?? 0,
                    api_rate_limit: plan.features?.api_features?.api_rate_limit ?? 0,
                };
            }

            return structuredPlan;
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.status, error.response?.data || error.message);
        } else {
            console.error("Error fetching plans:", error instanceof Error ? error.message : error);
        }

        throw new Error("Failed to fetch plans from the server.");
    }
};
