import { googleAuthHandler } from "@/handlers/googleAuthHandler";
import { Endpoint } from "payload";

export const googleAuthEndpoint : Endpoint = {

    path : '/auth/google/callback',

    method : 'get',

    handler : googleAuthHandler
}