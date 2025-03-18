import { API_KEY, BASE_URL } from "@/config/apiConfig";
import axios from "axios";
import { Payload } from "payload";
interface Plan {
    plan_name: string;
    month_plan_id: string;
    year_plan_id: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    currency: string;
    tokens ? : string;
    ai_tokens ? : number;
    seats ? : number;
    guests ? : number;
    monitoring ? : number;
    parallel_generation ? : number;
    api_rate_limit ? : number;
}

export const getPlansForSubscription = async (payload: Payload, order: "asc" | "desc" = "asc"): Promise<Plan[]> => {
    if (!API_KEY || !BASE_URL) {
        throw new Error("API_KEY or BASE_URL is missing in environment variables.");
    }

    try {

        const sortOrder = order === "asc" ? "monthly_price" : "-monthly_price"; // Sorting order

        const response = await payload.find({
            collection: "billing_plan",
            sort: sortOrder, // ✅ Sorting by `monthly_price`
            limit: 50 // Limit results if needed
        });

        const fetchedPlans = response.docs || []; // ✅ Ensures an array is always returned

        const fetchedStrucuturedPlans = fetchedPlans.map((plan) => ({
            plan_name: plan.plan_name ?? "",
            month_plan_id: plan.month_plan_id ?? "",
            year_plan_id: plan.year_plan_id ?? "",
            description: plan.description ?? "",
            monthly_price: plan.monthly_price ?? 0,
            yearly_price: plan.yearly_price ?? 0,
            currency: plan.currency ?? "",
            interval_unit: plan.interval_unit ?? "",
            features: {
                tokens: plan.features?.tokens ?? 0,
                backlinks_monitored: plan.features?.backlinks_monitored ?? 0,
                plugin_clicks: plan.features?.plugin_clicks ?? 0,
                keyword_searches: plan.features?.keyword_searches ?? 0,
                competitive_analyses: plan.features?.competitive_analyses ?? 0,
                simultaneous_bulk_competitive: plan.features?.simultaneous_bulk_competitive ?? 0,
            }
        }));

        return fetchedStrucuturedPlans.map(plan => ({
            plan_name: plan.plan_name,
            month_plan_id: plan.month_plan_id,
            year_plan_id: plan.year_plan_id,
            description: plan.description,
            monthly_price: plan.monthly_price,
            yearly_price: plan.yearly_price,
            currency: plan.currency,
            interval_unit: plan.interval_unit,
            results_per_search: plan.features.results_per_search,
            backlinks_monitored: plan.features.backlinks_monitored,
            plugin_clicks: plan.features.plugin_clicks,
            keyword_searches: plan.features.keyword_searches,
            competitive_analyses: plan.features.competitive_analyses,
            simultaneous_bulk_competitive: plan.features.simultaneous_bulk_competitive,
            bulk_keywords: plan.features.bulk_keywords,
            serp_scanner: plan.features.serp_scanner,
        }));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.status, error.response?.data || error.message);
        } else {
            console.error("Error fetching plans:", error instanceof Error ? error.message : error);
        }

        throw new Error("Failed to fetch plans from the server.");
    }
};
