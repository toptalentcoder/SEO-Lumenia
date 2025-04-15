// ✅ 1. Collection: serpVolatilityScores
import { CollectionConfig } from "payload";

export const SerpVolatilityScores: CollectionConfig = {
    slug: "serpVolatilityScores",
    admin: {
        useAsTitle: "category",
        defaultColumns: ["category", "date", "score"],
    },
    fields: [
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
        name: "score",
        type: "number",
        required: true,
        },
        {
        name: "features",
        type: "group",
        fields: [
            { name: "peopleAlsoAsk", type: "number" },
            { name: "imagePack", type: "number" },
            { name: "related", type: "number" },
            { name: "knowledgeGraph", type: "number" },
            { name: "newsPack", type: "number" },
        ],
        },
    ],
    indexes: [
        {
        fields: ["category", "date"],
        unique: true,
        },
    ],
};