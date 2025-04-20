import { CollectionConfig } from "payload";

export const SerpWeatherKeywords: CollectionConfig = {
    slug: "serpWeatherKeywords",
    admin: {
        useAsTitle: "keyword",
        defaultColumns: ["keyword", "category", "intent", "features", "volatilityScore", "createdAt"],
    },
    fields: [
        {
            name: "keyword",
            type: "text",
            required: true,
        },
        {
            name: "category",
            type: "select",
            options: [
                "News", "Adult", "Games", "Health", "Sports", "Finance", "Science", "Shopping",
                "Reference", "Real Estate", "Food & Drink", "Home & Garden", "Pets & Animals",
                "Autos & Vehicles", "Beauty & Fitness", "Jobs & Education", "Law & Government",
                "People & Society", "Hobbies & Leisure", "Books & Literature", "Internet & Telecom",
                "Online & Communities", "Arts & Entertainment", "Business & Industrial",
                "Computers & Electronics", "Travel & Transportation",
            ],
            required: true,
        },
        {
            name: "intent",
            type: "select",
            options: ["informational", "commercial", "navigational", "transactional"],
            required: true,
        },
        {
            name: "features",
            type: "array",
            unique: true,
            fields: [
                {
                name: "feature",
                type: "select",
                options: ["People Also Ask", "Knowledge Graph", "Image Pack", "Related", "News Pack"],
                },
            ],
        },
        {
            name: "volatilityScore",
            type: "number",
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "source",
            type: "text",
            defaultValue: "auto-generated",
        },
    ],
};
