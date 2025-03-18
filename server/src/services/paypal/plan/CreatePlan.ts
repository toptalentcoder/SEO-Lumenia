import { PAYPAL_API } from "@/globals/globalURLs";
import { createProduct } from "../catalogProducts/CreateProduct";
import { getAccessToken } from "../Authentication";
import { listActivePlans } from "./ListPlan";
import { Payload, CollectionSlug } from "payload";
import { deactivePlan } from "./DeactivePlan";

interface PlanPayload {
    name: string;
    description: string;
    interval_unit: "MONTH" | "YEAR";
    price: number;
    currency: "USD" | "EUR";
    category : "subscription" | "api";
}

const INTERVAL_PRICE_MULTIPLIERS: Record<string, number> = {
    MONTH: 1,
    YEAR: 12,
};

// Helper function to create plan payload
const createPlanPayload = (
    { name, description, interval_unit, price, currency }: PlanPayload,
    productID: string
) => {
    const adjustedPrice = (price * INTERVAL_PRICE_MULTIPLIERS[interval_unit]).toFixed(2);

    return {
        product_id: productID,
        name,
        description,
        status: "ACTIVE",
        billing_cycles: [
            {
                frequency: {
                    interval_unit,
                    interval_count: 1,
                },
                tenure_type: "REGULAR",
                sequence: 1,
                total_cycles: 0,
                pricing_scheme: {
                    fixed_price: {
                        value: adjustedPrice.toString(),
                        currency_code: currency || "USD", // Ensure currency is always valid
                    },
                },
            },
        ],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                value: "0",
                currency_code: currency || "USD",
            },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3,
        },
        taxes: {
            percentage: "0",
            inclusive: false,
        },
    };
};

// ✅ Function to create new PayPal plans and save them to Payload CMS
export const createPlansAndGetID = async (payload: Payload): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        let productID;

        const productIDFromGlobal =await payload.findGlobal({ slug : 'paypal_product_id'});

        if(!productIDFromGlobal.product_id){

            console.log("No product found in the database. Creating a new product.");

            const productFromPaypal = await createProduct();

            productID = productFromPaypal.id;

            await payload.updateGlobal({
                slug : 'paypal_product_id',
                data : {
                    product_id : productID
                }
            });

            console.log('Global Product ID updated successfully.')
        }else{
            productID = productIDFromGlobal.product_id;
            console.log('Product ID already exists.')
        }

        const planResponse = payload.find({ collection : 'billing_plan' as CollectionSlug });

        const plansFromDB = (await planResponse).docs;

        const activePayPalPlans = await listActivePlans();
        const databasePlanIDs = new Set(
            (plansFromDB as Array<{ month_plan_id?: string; year_plan_id?: string }>).flatMap(plan =>
                [plan.month_plan_id, plan.year_plan_id].filter(Boolean)
            )
        );
        const payPalPlanIDs = new Set(activePayPalPlans.map(plan => plan.plan_id));

        console.log("Database Plan IDs:", databasePlanIDs);
        console.log("PayPal Plan IDs:", payPalPlanIDs);

        const plans: PlanPayload[] = [
            {
                name: "Lite Plan",
                description: "Ideal for Freelancers. Light yet powerful, this plan offers access to all the essential tools for getting started in SEO. Manage multiple texts, monitor your keywords, and utilize semantic exploration tools. Bonus: buy images directly and follow our guides for easy-to-implement internal linking and semantic optimization. Perfect for those taking their first steps in content optimization.",
                interval_unit: "MONTH",
                price: 107,
                currency: "USD",
                category : "subscription"
            },
            {
                name: "Lite Plan Plus",
                description: "For Freelancers Who Want More. Take your SEO to the next level with increased capabilities for your texts and monitored keywords. You get access to additional AI tokens and options for enriching your content with images and advanced semantic tools. The ultimate tool for freelancers looking to upscale.",
                interval_unit: "MONTH",
                price: 140,
                currency: "USD",
                category : "subscription"
            },
            {
                name: "Essential Plan",
                description: "Your Team Needs This. Whether you're a startup or a consolidated team, this plan offers excellent value for the money. Invite team members and even external writers to collaborate. Detailed guides for semantic optimization and internal linking recommendations make this plan an essential tool for ambitious teams.",
                interval_unit: "MONTH",
                price: 247,
                currency: "USD",
                category : "subscription"
            },
            {
                name: "Enterprise Plan",
                description: "Optimized for Business Success. When you're looking to operate at scale, this plan has you covered. More seats, more guests, and advanced features for managing your SEO at an institutional level. Benefit from all premium features, from internal linking to image purchasing options, to ensure your business dominates the SERPs.",
                interval_unit: "MONTH",
                price: 431,
                currency: "USD",
                category : "subscription"
            },
            {
                name: "Agency Plan",
                description: "Excellence for Agencies and Power Users. For those who make no compromises on quality and efficiency. This plan offers unparalleled capabilities and cutting-edge tools for a robust SEO strategy. Manage multiple clients, collaborate with large teams, and benefit from our best guides and recommendations. The ultimate choice for agencies looking to offer the best to their clients.",
                interval_unit: "MONTH",
                price: 431,
                currency: "USD",
                category : "subscription"
            },
            {
                name: "API R1",
                description: "Kickstart your SEO Automation. If you're looking to integrate content optimization into your application or service, the API R1 plan is your ideal entry point. With parallel generation capabilities designed for small businesses or startups, this plan enables effective SEO automation without overwhelming you. Need to generate guides in an unlimited manner? It's included!",
                interval_unit: "MONTH",
                price: 432,
                currency: "USD",
                category : "api"
            },
            {
                name: "API R2",
                description: "Step Up the Pace. Do you have more intensive API usage? The API R2 plan is for you. Designed for medium-sized businesses and developers requiring more requests per minute, this plan boosts your parallel generation capabilities. More flexibility, more power, all while maintaining the ability to generate guides in an unlimited fashion.",
                interval_unit: "MONTH",
                price: 540,
                currency: "USD",
                category : "api"
            },
            {
                name: "API R3",
                description: "For Large Enterprises and Power Users. When you need the best, the API R3 plan offers unparalleled parallel generation capability, enabling large-scale SEO integration. This plan is perfect for large enterprises or services requiring a high volume of requests per minute. As always, unlimited guide generation is included, so you're never limited in your content optimization strategy.",
                interval_unit: "MONTH",
                price: 895,
                currency: "USD",
                category : "api"
            }
        ];

        const isExist = Array.from(databasePlanIDs).some((planId) =>
            activePayPalPlans.some((payPalPlan: { plan_id: string }) => payPalPlan.plan_id === planId)
        );

        if(!isExist){
            for (const plan of plans) {
                if (databasePlanIDs.has(plan.name)) {
                    console.log(`Skipping existing plan: ${plan.name}`);
                    continue;
                }

                console.log(`Creating new plan: ${plan.name}`);

                const monthPlanPayload = createPlanPayload({ ...plan, interval_unit: "MONTH", description : plan.description.split(".")[0] + "." }, productID);
                const yearPlanPayload = createPlanPayload({ ...plan, interval_unit: "YEAR", description : plan.description.split(".")[0] + "." }, productID);

                // ✅ Use Promise.all to create both plans in parallel
                const [monthResponse, yearResponse] = await Promise.all([
                    fetch(`${PAYPAL_API}/v1/billing/plans`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "PayPal-Request-Id": `PLAN-${Date.now()}-${plan.name}-MONTH`,
                        },
                        body: JSON.stringify(monthPlanPayload),
                    }),
                    fetch(`${PAYPAL_API}/v1/billing/plans`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "PayPal-Request-Id": `PLAN-${Date.now()}-${plan.name}-YEAR`,
                        },
                        body: JSON.stringify(yearPlanPayload),
                    }),
                ]);

                if (!monthResponse.ok || !yearResponse.ok) {
                    console.error(
                        `Error creating ${plan.name}:`,
                        await monthResponse.json(),
                        await yearResponse.json()
                    );
                    continue;
                }

                const monthData = await monthResponse.json();
                const yearData = await yearResponse.json();

                console.log(`${plan.name} Created Successfully.`);

                await payload.create({
                    collection: "billing_plan" as CollectionSlug,
                    data: {
                        plan_name: plan.name, // Keep existing plan_name if available
                        description: plan.description,
                        monthly_price: plan.price,
                        yearly_price: plan.price * INTERVAL_PRICE_MULTIPLIERS.YEAR,
                        month_plan_id: monthData.id,
                        year_plan_id: yearData.id,
                        currency: plan.currency,
                        interval_unit: "MONTH",
                        category: plan.category, // Add a valid category value
                    },
                });
                console.log(`Created plan: ${plan.name}`);

                databasePlanIDs.add(monthData.id);
                databasePlanIDs.add(yearData.id);
            }
        }

        console.log("All plans processed successfully.");
    } catch (error) {
        console.error("Error creating plans:", error);
    }
};


export const createPlanForUpdateValues = async (
    updatedPlan: {
        plan_name: string;
        description: string;
        interval_unit: "MONTH" | "YEAR";
        monthly_price?: number;
        yearly_price?: number;
        currency: "USD" | "EUR";
        month_plan_id?: string; // ✅ Now included
        year_plan_id?: string;  // ✅ Now included
        category? : "subscription" | "api";
    },
    productID: string,
    shouldDeactivateMonth: boolean = false, // Controls whether the month plan should be deactivated
    shouldDeactivateYear: boolean = false  // Controls whether the year plan should be deactivated
) => {
    const accessToken = await getAccessToken();

    // Validate and format price
    const validatedPrice = (price?: number) => (price ? price.toFixed(2) : "0.00");

    // Ensure price values exist
    const monthPrice = validatedPrice(updatedPlan.monthly_price);
    const defaultYearlyPrice = updatedPlan.monthly_price ? updatedPlan.monthly_price * 12 : 0;
    const yearPrice = validatedPrice(updatedPlan.yearly_price !== undefined ? updatedPlan.yearly_price : defaultYearlyPrice);

    // Prepare payloads
    const monthPlanPayload = createPlanPayload({
        ...updatedPlan,
        name: updatedPlan.plan_name,
        interval_unit: "MONTH",
        price: parseFloat(monthPrice),
        category : updatedPlan.category || "subscription"
    }, productID);

    const yearPlanPayload = createPlanPayload({
        ...updatedPlan,
        name: updatedPlan.plan_name,
        interval_unit: "YEAR",
        price: parseFloat(yearPrice),
        category : updatedPlan.category || "subscription"
    }, productID);

    console.log(`Processing PayPal plans for ${updatedPlan.plan_name}...`);

    let monthPlanId = null;
    let yearPlanId = null;

    if (shouldDeactivateMonth && updatedPlan.month_plan_id) {
        console.log(`Deactivating existing MONTH plan...`);
        await deactivePlan(updatedPlan.month_plan_id); // ✅ Guaranteed to be a string
    } else if (shouldDeactivateMonth) {
        console.warn(`Skipping MONTH plan deactivation: No valid month_plan_id found.`);
    }

    if (shouldDeactivateYear && updatedPlan.year_plan_id) {
        console.log(`Deactivating existing YEAR plan...`);
        await deactivePlan(updatedPlan.year_plan_id); // ✅ Guaranteed to be a string
    } else if (shouldDeactivateYear) {
        console.warn(`Skipping YEAR plan deactivation: No valid year_plan_id found.`);
    }

    // Create only the necessary plans
    if (shouldDeactivateMonth) {
        console.log(`Creating new MONTH plan for ${updatedPlan.plan_name}...`);
        const monthResponse = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "PayPal-Request-Id": `PLAN-${Date.now()}-${updatedPlan.plan_name}-MONTH`,
            },
            body: JSON.stringify(monthPlanPayload),
        });

        if (monthResponse.ok) {
            const monthData = await monthResponse.json();
            monthPlanId = monthData.id;
        } else {
            console.error(`Error creating MONTH plan for ${updatedPlan.plan_name}:`, await monthResponse.json());
        }
    }

    if (shouldDeactivateYear) {
        console.log(`Creating new YEAR plan for ${updatedPlan.plan_name}...`);
        const yearResponse = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "PayPal-Request-Id": `PLAN-${Date.now()}-${updatedPlan.plan_name}-YEAR`,
            },
            body: JSON.stringify(yearPlanPayload),
        });

        if (yearResponse.ok) {
            const yearData = await yearResponse.json();
            yearPlanId = yearData.id;
        } else {
            console.error(`Error creating YEAR plan for ${updatedPlan.plan_name}:`, await yearResponse.json());
        }
    }

    return {
        success: !!(monthPlanId || yearPlanId),
        month_plan_id: monthPlanId,
        year_plan_id: yearPlanId,
    };
};
