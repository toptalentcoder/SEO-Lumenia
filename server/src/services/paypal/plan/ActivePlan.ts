import { PAYPAL_API } from "@/globals/globalURLs";

export const ActivatePlan = async (planID : string, accessToken : string) => {

    const response = await fetch(`${PAYPAL_API}/v1/billing/plans/${planID}/activate`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: '',
    });

    if (!response.ok) {
        const error = await response.json();
        console.error(`Error activating :`, error);
        return null; // Return null if the plan creation fails
    }

    return response;
}