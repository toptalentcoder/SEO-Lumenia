import { PAYPAL_API } from "@/globals/globalURLs";
import { getAccessToken } from "../Authentication";

interface ListPlan {
    id: string;
    name: string;
    status?: string;
    billing_cycles? : Array<{
        frequency? : {
            interval_unit? : string
        },
        pricing_scheme? : {
            fixed_price? : {
                value? : string;
                currency_code? : string
            }
        }
    }>,
    description? : string;
    // Add other relevant fields here
}

interface ActivePlan {
    plan_id : string;
    plan_name: string;
    description: string;
    interval_unit: string;
    price: number;
    currency: "USD" | "EUR" | null | undefined;
}

export const listActivePlans = async (): Promise<ActivePlan[]> => {

    const accessToken = await getAccessToken();

    const activePlans: ActivePlan[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(
            `${PAYPAL_API}/v1/billing/plans?page_size=20&page=${currentPage}&total_required=true`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );

        const data = await response.json();
        if (data.plans && data.plans.length > 0) {
            // Iterate over the retrieved plans and map them to the ActivePlan interface
            data.plans.forEach((plan: ListPlan) => {
                if (plan.status === 'ACTIVE' && plan.billing_cycles) {
                    const firstBillingCycle = plan.billing_cycles[0];
                    const price = firstBillingCycle?.pricing_scheme?.fixed_price?.value
                        ? parseFloat(firstBillingCycle.pricing_scheme.fixed_price.value)
                        : 0;
                    const currency = firstBillingCycle?.pricing_scheme?.fixed_price?.currency_code || null;
                    const interval_unit = firstBillingCycle?.frequency?.interval_unit || '';

                    activePlans.push({
                        plan_id : plan.id,
                        plan_name: plan.name,
                        description: plan.description || "",
                        interval_unit: interval_unit,  // Defaulting to "MONTH", you can adjust as needed
                        price: price,
                        currency: currency === "USD" || currency === "EUR" ? currency : null,
                    });
                }
            });

            // Check if there are more plans to fetch
            if (data.total_items > currentPage * 20) {
                currentPage += 1;
            } else {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    return activePlans;
};
