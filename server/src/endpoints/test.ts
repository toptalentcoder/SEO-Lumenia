import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSEOKeywords } from "@/services/generateSEOKeywords";
import { Endpoint } from "payload";

export const testEndpoint: Endpoint = {
    path: '/test',
    method: 'post',
    handler: withErrorHandling(async (req): Promise<Response> => {

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await req.json();
        const { query, location, language } = body;

        // Generate the SEO keywords
        const keywordsResponse = await generateSEOKeywords(query, location, language);

        // Clean the response from OpenAI, assuming it's returned as a string containing JSON
        try {
            // Parse the JSON string and extract the keywords array
            const parsedResponse = JSON.parse(keywordsResponse);
            const keywordsArray = parsedResponse[query]; // Get the array for the specific query

            // Return the keywords array in the response
            return new Response(JSON.stringify({ keywords: keywordsArray }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            // Handle any parsing errors
            return new Response(
                JSON.stringify({ error: "Error parsing the keywords response" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    })
};
