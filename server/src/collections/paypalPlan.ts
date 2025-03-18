import { createPlanForUpdateValues } from "@/services/paypal/plan/CreatePlan";
import { deactivePlan } from "@/services/paypal/plan/DeactivePlan";
import { CollectionConfig, CollectionSlug } from "payload";

export const BillingPlan: CollectionConfig = {
    slug: "billing_plan",
    admin: {
        useAsTitle: "category",
        hideAPIURL: true
    },
    labels: {
        singular: "Billing Plan",
        plural: "Billing Plans"
    },
    access: {
        read: () => true,
        update: ({ req }) => req.user?.role === "admin",
        delete: ({ req }) => req.user?.role === "admin",
    },

    fields: [
        { name: "plan_name", type: "text", label: "Plan Name" },
        { name: "month_plan_id", type: "text", unique: true, admin: { hidden: true }, label: "Month Plan ID" },
        { name: "year_plan_id", type: "text", unique: true, admin: { hidden: true }, label: "Year Plan ID" },
        { name: "description", type: "text", label: "Description" },
        { name: "monthly_price", type: "number", admin: { placeholder: "Enter Monthly price" }, label: "Monthly Price" },
        { name: "yearly_price", type: "number", admin: { placeholder: "Enter Yearly Price (Auto-calculated if empty)" }, label: "Yearly Price" },
        {
            name: "interval_unit",
            type: "select",
            required: true,
            defaultValue: "MONTH", // ✅ Default value set to "MONTH"
            options: [
                { label: "Month", value: "MONTH" },
                { label: "Year", value: "YEAR" }
            ],
            admin: {
                hidden: true,
                condition: () => true
            }
        },
        {
            name: "category",
            type: "select",
            required: true,
            defaultValue: "subscription",
            options: [
                { label: "Subscription", value: "subscription" },
                { label: "API", value: "api" },
            ],
            label: "Plan Category"
        },

        {
            name: "currency",
            type: "select",
            defaultValue: "USD",
            options: [
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" }
            ]
        },

        {
            name: "features",
            type: "group",
            fields: [
                // Features for Subscription Plans
                {
                    name: "subscription_features",
                    type: "group",
                    admin: { condition: (data) => data.category === "subscription" },
                    fields: [
                        { name: "tokens", type: "number", label: "Tokens" },
                        { name: "ai_tokens", type: "number", label: "AI Tokens" },
                        { name: "seats", type: "number", label: "Seats" },
                        { name: "guests", type: "number", label: "Guests" },
                        { name: "monitoring", type: "number", label: "Monitoring" },
                    ]
                },

                // Features for API Plans
                {
                    name: "api_features",
                    type: "group",
                    admin: { condition: (data) => data.category === "api" },
                    fields: [
                        { name: "parallel_generation", type: "number", label: "Parallel Generation Requests" },
                        { name: "api_rate_limit", type: "number", label: "API Rate Limit (Requests Per Minute)" },
                    ]
                }
            ]
        }
    ],
    hooks: {
        beforeChange: [
            async ({ data, originalDoc, req }) => {
                if (!req?.user || req?.user?.role !== "admin") {
                    console.log("Skipping PayPal plan update: Not an admin request.");
                    return data;
                }

                let existingDoc = originalDoc;

                // 🔹 Fetch the existing document if `originalDoc` is missing
                if (!existingDoc && data.id) {
                    existingDoc = await req.payload.findByID({
                        collection: "billing_plan" as CollectionSlug,
                        id: data.id
                    }).catch(() => null);
                }

                // 🔹 Ensure `interval_unit` exists before proceeding
                if (!data.interval_unit) {
                    console.error("❌ Error: Missing `interval_unit`");
                    throw new Error("Invalid data: `interval_unit` is required.");
                }

                const productIDFromGlobal = await req.payload.findGlobal({ slug: "paypal_product_id" });
                const productID = productIDFromGlobal?.product_id;

                if (!productID) {
                    console.error("❌ Error: PayPal Product ID not found in global settings.");
                    throw new Error("PayPal Product ID is required for PayPal integration.");
                }

                // ✅ Prepare PayPal plan data
                const planData = {
                    plan_name: data.plan_name,
                    description: data.description,
                    interval_unit: data.interval_unit,
                    monthly_price: data.monthly_price,
                    yearly_price: data.yearly_price,
                    currency: data.currency,
                    month_plan_id: data.month_plan_id,
                    year_plan_id: data.year_plan_id,
                    category : data.category
                };

                // ✅ If this is a **new plan**, create it in PayPal
                if (!existingDoc) {
                    console.log(`✅ Creating new PayPal plan: ${data.plan_name}`);
                    try {
                        const { success, month_plan_id, year_plan_id } = await createPlanForUpdateValues(planData, productID, true, true);
                        if (success) {
                            data.month_plan_id = month_plan_id;
                            data.year_plan_id = year_plan_id;
                        }
                    } catch (error) {
                        console.error("❌ Error creating PayPal plan:", error);
                        throw new Error("PayPal plan creation failed. Rolling back.");
                    }
                    return data; // ✅ Return updated data
                }

                // ✅ Detect Changes That Require Deactivation
                let shouldDeactivateMonth = false;
                let shouldDeactivateYear = false;

                if (
                    data.currency !== existingDoc.currency ||
                    data.plan_name !== existingDoc.plan_name ||
                    data.description !== existingDoc.description
                ) {
                    shouldDeactivateMonth = true;
                    shouldDeactivateYear = true;
                } else {
                    if (data.monthly_price !== existingDoc.monthly_price) shouldDeactivateMonth = true;
                    if (data.yearly_price !== existingDoc.yearly_price) shouldDeactivateYear = true;
                }

                // ✅ Deactivate & Recreate PayPal Plan If Needed
                if (shouldDeactivateMonth || shouldDeactivateYear) {
                    console.log(`🔄 Updating PayPal plan for ${existingDoc.plan_name}`);

                    try {
                        const { success, month_plan_id, year_plan_id } = await createPlanForUpdateValues(planData, productID, shouldDeactivateMonth, shouldDeactivateYear);
                        if (success) {
                            if (shouldDeactivateMonth) data.month_plan_id = month_plan_id;
                            if (shouldDeactivateYear) data.year_plan_id = year_plan_id;
                        } else {
                            throw new Error("Failed to create updated PayPal plan.");
                        }
                    } catch (error) {
                        console.error("❌ Error updating PayPal plan:", error);
                        throw new Error("PayPal plan update failed. Rolling back.");
                    }
                }

                return data;
            }
        ],
        beforeDelete: [
            async ({ id, req }) => {
                if (!req?.user || req?.user?.role !== "admin") {
                    console.log("Skipping PayPal plan deletion: Not an admin request.");
                    return;
                }

                console.log(`🔴 Deleting plan with ID: ${id}`);

                // ✅ Fetch the document to get PayPal plan IDs
                const plan = await req.payload.findByID({
                    collection: "billing_plan" as CollectionSlug,
                    id
                }) as { month_plan_id?: string, year_plan_id?: string };

                if (!plan) {
                    console.log(`⚠️ Plan with ID ${id} not found, skipping PayPal deactivation.`);
                    return;
                }

                try {
                    if (plan.month_plan_id) {
                        console.log(`🔻 Deactivating PayPal MONTH plan: ${plan.month_plan_id}`);
                        await deactivePlan(plan.month_plan_id);
                    } else {
                        console.log("⚠️ No MONTH plan found for this document.");
                    }

                    if (plan.year_plan_id) {
                        console.log(`🔻 Deactivating PayPal YEAR plan: ${plan.year_plan_id}`);
                        await deactivePlan(plan.year_plan_id);
                    } else {
                        console.log("⚠️ No YEAR plan found for this document.");
                    }

                    console.log(`✅ Successfully deactivated PayPal plans before deletion.`);
                } catch (error) {
                    console.error("❌ Error deactivating PayPal plans before deletion:", error);
                }
            }
        ]
    }
};
