// src/collections/InternalUrls.ts
import type { CollectionConfig } from "payload";

export const InternalUrls: CollectionConfig = {
    slug: "internal-url",
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
    },
    fields: [
        {
            name: "baseUrl",
            type: "text",
            required: true,
            unique: true,
        },
        {
            name: "urls",
            type: "array",
            fields: [
                {
                    name: "url",
                    type: "text",
                    required: true,
                },
            ],
        },
        {
            name: "fetchedAt",
            type: "date",
        },
    ],
};
