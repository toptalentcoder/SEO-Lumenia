import { PAYPAL_API } from "@/globals/globalURLs";
import { getAccessToken } from "../Authentication";

export const deactivePlan = async (planID : string) => {

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v1/billing/plans/${planID}/deactivate`, {
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
        console.error(`Error deactivating :`, error);
        return null; // Return null if the plan creation fails
    }

    return response;
}