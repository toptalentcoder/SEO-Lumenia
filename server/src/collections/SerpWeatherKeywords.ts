import { CollectionConfig } from "payload";

const Keywords: CollectionConfig = {
    slug: "keywords",
    admin: {
        useAsTitle: "keyword",
        defaultColumns: ["keyword", "category", "intent", "features", "createdAt"],
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
        },
        {
            name: "features",
            type: "array",
            fields: [
                {
                    name: "feature",
                    type: "select",
                    options: ["People Also Ask", "Knowledge Graph", "Image Pack", "Related", "News Pack"],
                },
            ],
        },
        {
            name: "source",
            type: "text",
            defaultValue: "auto-generated",
        },
    ],
};

export default Keywords;
