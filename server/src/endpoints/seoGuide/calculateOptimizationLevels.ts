import { withErrorHandling } from "@/middleware/errorMiddleware";
import { processText } from "@/service/createSeoGuide/processText";
import { Endpoint, PayloadRequest } from "payload";

export const calculateOptimizationLevels: Endpoint = {

    path: "/calculate_optimization_levels",

    method: 'post',

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await req.json();
        const { currentText, keywords }: { currentText: string[]; keywords: string[] } = body;

        if (!currentText || !keywords) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid currentText" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const keywordOptimizations = [];

        // Ensure currentText is an array of strings and processed correctly
        const processedTokens = currentText
            .filter((text: string): text is string => !!text)  // Filter out invalid texts
            .map(processText)  // Process each text
            .flat();  // Flatten the array if processText returns arrays

        // Loop over the keywords to calculate their frequency
        for (const keyword of keywords) {
            const keywordNormalized = keyword.toLowerCase();

            // Normalize the document content (processedTokens)
            const docNormalized = processedTokens
                .map(word => word.toLowerCase().replace(/[^\w\s]/g, ''))  // Remove punctuation
                .filter(Boolean);  // Remove empty tokens

            // Calculate the frequency of the keyword
            const keywordCount = docNormalized.filter((word) => word === keywordNormalized).length;

            // Calculate frequency (scaled by 10000 for better resolution)
            const frequency = keywordCount / processedTokens.length * 1000;

            // Push the result to keywordOptimizations
            keywordOptimizations.push({
                keyword,
                value: frequency
            });
        }

        // Return the result
        return new Response(
            JSON.stringify({ success: true, keywordOptimizations }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    })
};
