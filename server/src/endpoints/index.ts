import { googleAuthEndpoint } from "./auth/googleAuthEndpoint";
import { paypalSubscriptionEndpoint } from "./paypal/createSubscriptionEndpoint";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint";

export const customEndpoints = [
    googleAuthEndpoint,
    getPlansFromDbEndpoint,
    paypalSubscriptionEndpoint
]