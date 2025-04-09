import { seedKeywordsMap } from "@/globals/seedKeywordsMap";
import { Payload } from "payload";
import { generateKeywordsForSERPWeatherCategory } from "./generateKeywords";

export const saveKeywordsForSERPWeatherCategory = async (payload: Payload) => {
  const results: Record<string, number> = {};

  for (const category of Object.keys(seedKeywordsMap)) {
    try {
      const keywords = await generateKeywordsForSERPWeatherCategory(category);

      // Step 1: Fetch all existing keywords in this category
      const existing = await payload.find({
        collection: "serpWeatherKeywords",
        where: {
          category: { equals: category },
        },
        limit: 1000, // assumes <1000 keywords per category
      });

      const existingMap = new Map<string, string>(); // keyword => id
      for (const doc of existing.docs) {
        if (typeof doc.keyword === "string") {
          existingMap.set(doc.keyword.toLowerCase(), String(doc.id));
        }
      }

      const toInsert = [];
      const toUpdate = [];

      for (const keyword of keywords) {
        const lower = keyword.toLowerCase();
        if (existingMap.has(lower)) {
          toUpdate.push({
            id: existingMap.get(lower),
            data: {
              source: "auto-generated",
              updatedAt: new Date(),
            },
          });
        } else {
          toInsert.push({
            keyword,
            category,
            source: "auto-generated",
          });
        }
      }

      // Step 2: Insert new keywords in parallel
      await Promise.allSettled(
        toInsert.map((data) =>
          payload.create({ collection: "serpWeatherKeywords", data })
        )
      );

      // Step 3: Update existing keywords in parallel
      await Promise.allSettled(
        toUpdate.map((entry) =>
          payload.update({
            collection: "serpWeatherKeywords",
            id: entry.id!,
            data: entry.data,
          })
        )
      );

      results[category] = keywords.length;
    } catch (err) {
      console.error(`❌ Error generating keywords for ${category}:`, err);
      results[category] = 0;
    }
  }

  return new Response(
    JSON.stringify({ success: true, inserted: results }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
