// ✅ 1. Collection: serpSnapshots
import { CollectionConfig } from "payload";

export const SerpSnapshots: CollectionConfig = {
    slug: "serpSnapshots",
    admin: {
        useAsTitle: "keyword",
        defaultColumns: ["keyword", "category", "date"],
    },
    fields: [
            {
            name: "keyword",
            type: "text",
            required: true,
        },
        {
            name: "category",
            type: "text",
            required: true,
        },
        {
            name: "date",
            type: "date",
            required: true,
        },
        {
            name: "results",
            type: "array",
            fields: [
                { name: "rank", type: "number", required: true },
                { name: "title", type: "text", required: true },
                { name: "link", type: "text", required: true },
            ],
        },
        {
            name: "source",
            type: "text",
            defaultValue: "serpapi",
        },
    ],
};