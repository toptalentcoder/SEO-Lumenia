import { GlobalConfig } from "payload";

export const paypalProductID : GlobalConfig = {

    slug : 'paypal_product_id',
    label : 'Paypal Product ID',
    access : {
        read : () => true,
        update : () => true
    },
    admin : { hidden : false },
    fields : [
        {
            name : 'product_id',
            type : 'text',
            label : 'Product ID',
        }
    ]
}