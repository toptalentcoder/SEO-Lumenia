import { PAYPAL_API } from "@/globals/globalURLs";
import { getAccessToken } from "../Authentication";
import { ErrorHandler } from "@/handlers/errorHandler";

interface PayPalLink {
    href: string;
    rel: string;
    method: string;
}

interface PayPalResponse {
    links: PayPalLink[];
}

export const createSubscription = async(planID : string) => {

    if (!planID) {
        throw new Error("Invalid plan ID provided");
    }

    try{

        const accessToken = await getAccessToken();

        const subscriptionPayload = {
            "plan_id": planID, // Required: The ID of the plan you want to subscribe to
            "start_time": new Date(new Date().getTime() + 60000).toISOString(), // Required: ISO 8601 format start time
            "quantity": 1, // Required: Quantity of the subscription
            "application_context": {
                "brand_name": "YourTextSEO", // Optional but good for display purposes
                "locale": "en-US", // Optional: Locale for user interface
                "user_action": "SUBSCRIBE_NOW", // Optional: Sets user action
                "return_url": "https://lumenia.io/plans", // Required: Where the user is redirected after approval
                "cancel_url": "https://lumenia.io/plans", // Required: Where the user is redirected after cancelation
            },
        };

        const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
            method : 'POST',
            headers : {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "PayPal-Request-Id": `SUBSCRIPTION-${Date.now()}`,
                Prefer: "return=representation",
            },
            body : JSON.stringify(subscriptionPayload)
        })

        if(!response.ok){
            throw new Error(`Failed to create subscription : ${response.statusText}`);
        }

        const data : PayPalResponse = await response.json();

        // Find the approval link
        const approvalUrl = data.links.find((link) => link.rel === "approve")?.href;

        if (!approvalUrl) {
            throw new Error("Approval URL not found in PayPal response");
        }

        return approvalUrl; // Return the approval URL

    }catch(error){

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching subscription creation");
        return errorDetails.context;

    }
}