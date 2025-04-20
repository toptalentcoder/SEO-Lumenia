import { CollectionConfig } from "payload";

export const SerpVolatilityScores: CollectionConfig = {
    slug: "serpVolatilityScores",
    admin: {
        useAsTitle: "category",
        defaultColumns: ["category", "date", "score", "scoreLevel"],
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
            name: "scoreLevel",
            type: "select",
            options: ["low", "medium", "high", "extreme"],
        },
        {
            name: "features",
            type: "group",
            fields: [
                { name: "peopleAlsoAsk", type: "number", defaultValue: 0 },
                { name: "imagePack", type: "number", defaultValue: 0 },
                { name: "related", type: "number", defaultValue: 0 },
                { name: "knowledgeGraph", type: "number", defaultValue: 0 },
                { name: "newsPack", type: "number", defaultValue: 0 },
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
