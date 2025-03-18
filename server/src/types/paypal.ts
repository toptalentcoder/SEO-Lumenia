// Plan interface with price as a string
export interface Plan {
    plan_id: string; // Stores the PayPal plan ID (either monthly or yearly)
    plan_name: string;
    description?: string;
    currency: "USD" | "EUR"; // Removed `null | undefined` for stricter type safety

    // ✅ Store both MONTH and YEAR pricing inside a single object
    monthly_price: number;
    yearly_price: number;

    // ✅ Store both PayPal plan IDs (one for each interval)
    month_plan_id?: string; // Made optional (useful when creating new plans)
    year_plan_id?: string; // Made optional (useful when creating new plans)

    // ✅ Additional metadata (if needed in the future)
    status?: "ACTIVE" | "INACTIVE"; // Tracks whether the plan is active
    created_at?: string; // ISO timestamp when the plan was created
    updated_at?: string; // ISO timestamp when the plan was last updated

    interval_unit : "MONTH" | "YEAR";
}