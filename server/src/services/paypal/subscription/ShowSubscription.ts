import { ErrorHandler } from "@/handlers/errorHandler";
import { getAccessToken } from "../Authentication";
import { PAYPAL_API } from "@/globals/globalURLs";

interface showSubscriptionResponse{
    billing_info? : {
        next_billing_time? : string
    }
    status? : string
}

export const showSubscription = async(subscriptionID : string) => {

    if(!subscriptionID){
        throw new Error("Invalid subscription provied.")
    }

    try{

        const accessToken = await getAccessToken();

        const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionID}`, {
            method : 'GET',
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(!response.ok){
            throw new Error(`Failed to show subscription : ${response.statusText}`);
        }

        const data : showSubscriptionResponse = await response.json();

        const nextBillingTime = data?.billing_info?.next_billing_time;
        const subscriptionStatus = data?.status;

        return {
            nextBillingTime: nextBillingTime ? nextBillingTime : '',
            subscriptionStatus: subscriptionStatus ? subscriptionStatus : ''
        };

    }catch(error){

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching subscription creation");
        return errorDetails.context;

    }
}
