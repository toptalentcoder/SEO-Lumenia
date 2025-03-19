import { googleAuthEndpoint } from "./auth/googleAuthEndpoint";
import { getUserDataForRefreshPageEndpoint } from "./getUserDataForRefreshPageEndpoint";
import { paypalSubscriptionEndpoint } from "./paypal/createSubscriptionEndpoint";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint";
import { saveSubscriptionToUserCollection } from "./paypal/saveSubscriptionTpDbEndpoint";
import { showSubscriptionEndpoint } from "./paypal/showSubscriptionEndpoint";

export const customEndpoints = [
    googleAuthEndpoint,
    getPlansFromDbEndpoint,
    paypalSubscriptionEndpoint,
    showSubscriptionEndpoint,
    saveSubscriptionToUserCollection,
    getUserDataForRefreshPageEndpoint,
]