import { ErrorHandler } from '../../../handlers/errorHandler';
import { getAccessToken } from '../Authentication';
import { PAYPAL_API } from '../../../globals/globalURLs';

export const createProduct = async() => {

    try{

        const accessToken = await getAccessToken();

        const productPayload = {
            "name" : "YourText",
            "description" : "A platform for SEO analysis, keyword research, competitive analysis, and backlink monitoring. Includes multiple subscription tiers with various features.",
            "type" : "SERVICE",
            "category" : "SOFTWARE",
            "image_url" : "https://link-finder.net/logo.png",
            "home_url": "https://surferlink.io"
        }

        const response = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
            method : "POST",
            headers : {
                'Authorization' : `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'PayPal-Request-Id': `PRODUCT-${Date.now()}`,
                'Prefer': 'return=representation'
            },
            body : JSON.stringify(productPayload)
        })

        if(!response.ok){
            throw new Error(`Failed to create product: ${response.statusText}`);
        }

        const responseJSON = await response.json();

        return responseJSON;

    }catch(error){

        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Paperclub");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });

    }
}