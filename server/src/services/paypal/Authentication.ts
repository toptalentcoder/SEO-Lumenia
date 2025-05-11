import { PAYPAL_API } from "../../globals/globalURLs";
import { ErrorHandler } from "../../handlers/errorHandler";
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "@/config/apiConfig";

export const getAccessToken = async() : Promise<string> => {

    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');

    try{

        const authorization = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

        const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
            method : 'POST',
            headers : {
                'Authorization' : `Basic ${authorization}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body : formData.toString()
        })

        if(!response.ok){
            throw new Error(`Failed to get access token: ${response.statusText}`);
        }

        const responseJSON = await response.json();

        return responseJSON.access_token;

    }catch(error){

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for getAuthnetication");
        return errorDetails.context;

    }
}