import { PAYPAL_API } from "../../../globals/globalURLs";
import { getAccessToken } from "../Authentication";

export const listProducts = async () => {

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v1/catalogs/products?page_size=20&page=1&total_required=true`, {
        method : 'GET',
        headers : {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.statusText}`);
    }

    const data = await response.json();

    return data;

}