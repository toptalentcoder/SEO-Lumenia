import { googleAuthEndpoint } from "./auth/googleAuthEndpoint";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint";

export const customEndpoints = [
    googleAuthEndpoint,
    getPlansFromDbEndpoint
]