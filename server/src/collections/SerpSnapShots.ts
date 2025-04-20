import { CollectionConfig } from "payload";

export const SerpSnapshots: CollectionConfig = {
  slug: "serpSnapshots",
  admin: {
    useAsTitle: "keyword",
    defaultColumns: ["keyword", "category"],
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
      name: "tracking",
      type: "array",
      fields: [
        { name: "date", type: "text", required: true },
        {
          name: "results",
          type: "array",
          fields: [
            { name: "rank", type: "number", required: true },
            { name: "title", type: "text", required: true },
            { name: "link", type: "text", required: true },
          ],
        },
      ],
    },
  ],
  indexes: [
    {
      fields: ["keyword"],
      unique: true,
    },
  ],
};
