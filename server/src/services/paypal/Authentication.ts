import { PAYPAL_API } from "../../globals/globalURLs";
import { ErrorHandler } from "../../handlers/errorHandler";
<<<<<<< HEAD

export const getAccessToken = async() : Promise<string> => {

    const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

=======
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "@/config/apiConfig";

export const getAccessToken = async() : Promise<string> => {

>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');

    try{

<<<<<<< HEAD
        const authorization = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
=======
        const authorization = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

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