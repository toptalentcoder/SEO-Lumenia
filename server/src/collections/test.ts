import { CollectionConfig } from "payload";

export const testData : CollectionConfig = {
    slug : "test",
    admin : {

    },
    access : {
        create : () => true,
        read : () => true
    },
    fields: [
        {
            name : 'aaaaa',
            type: 'number',
        }
    ]
}