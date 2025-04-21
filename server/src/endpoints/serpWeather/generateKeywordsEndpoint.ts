import { withErrorHandling } from "@/middleware/errorMiddleware";
import { calculateImprovedSerpVolatility } from "@/services/serpWeather/calculateSerpVolatility";
import { saveDailyVolatilityScores } from "@/services/serpWeather/trackKeywords";
import { generateKeywordsForSERPWeatherCategory } from "@/services/serpWeather/generateKeywords";
import { saveKeywordsForSERPWeatherCategory } from "@/services/serpWeather/saveKeywordsToDB";
import { seedKeywordsMap } from "@/globals/seedKeywordsMap";
import { Endpoint, PayloadRequest } from "payload";

export const generateKeywordsEndpoint: Endpoint = {
    path: "/generateKeywords",
    method: "get",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const { category, generateNew = "true", saveToDb = "true" } = req.query;

        try {
            // If category is specified, generate keywords for that category only
            if (category && typeof category === 'string') {
                const keywords = await generateKeywordsForSERPWeatherCategory(category);
                
                if (saveToDb === "true") {
                    // Save keywords for this category
                    const saveResponse = await saveKeywordsForSERPWeatherCategory(payload);
                    const saveData = await saveResponse.json();
                    
                    return new Response(
                        JSON.stringify({
                            success: true,
                            category,
                            keywords,
                            saved: saveData.inserted[category] || 0,
                            message: `Generated ${keywords.length} keywords for category: ${category} and saved to database`
                        }),
                        {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                }

                return new Response(
                    JSON.stringify({
                        success: true,
                        category,
                        keywords,
                        message: `Generated ${keywords.length} keywords for category: ${category}`
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }

            // If no category specified, generate for all categories from seedKeywordsMap
            const results: Record<string, string[]> = {};
            const categories = Object.keys(seedKeywordsMap);

            for (const cat of categories) {
                if (generateNew === "true") {
                    results[cat] = await generateKeywordsForSERPWeatherCategory(cat);
                }
            }

            let saveResults: { inserted?: Record<string, number> } = {};
            if (saveToDb === "true") {
                // Save all keywords to database
                const saveResponse = await saveKeywordsForSERPWeatherCategory(payload);
                saveResults = await saveResponse.json();
            }

            // Calculate volatility scores
            const date = new Date().toISOString().split("T")[0];
            const volatilityScores = await calculateImprovedSerpVolatility(payload, date);

            return new Response(
                JSON.stringify({
                    success: true,
                    results,
                    saved: saveResults.inserted || {},
                    volatilityScores,
                    message: `Generated keywords for ${categories.length} categories${saveToDb === "true" ? " and saved to database" : ""}`
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );

        } catch (error) {
            console.error("Error in generateKeywordsEndpoint:", error);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error occurred",
                    message: "Failed to generate keywords"
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    })
};