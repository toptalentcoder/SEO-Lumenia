import { withErrorHandling } from "@/middleware/errorMiddleware";
import { processText } from "@/service/createSeoGuide/processText";
import { Endpoint, PayloadRequest } from "payload";

export const calculateOptimizationLevels : Endpoint = {

    path : "/calculate_optimization_levels",

    method : 'post',

    handler : withErrorHandling(async(req: PayloadRequest): Promise<Response> => {
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

        const processedTokens = currentText
            .filter((text: string): text is string => !!text)
            .map(processText);

            console.log(processedTokens)
        for(const keyword of keywords){

            const keywordNormalized = keyword.toLowerCase();
            const docNormalized = processedTokens.flat().map(word => word.toLowerCase().replace(/[^\w\s]/g, '')); // Strip punctuation
            const keywordCount = docNormalized.filter((word) => word === keywordNormalized).length;

            const frequency = keywordCount / processedTokens.length * 10000;

            keywordOptimizations.push({
                keyword,
                value : frequency
            });
        }

        return new Response(
            JSON.stringify({ success: true, keywordOptimizations }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    })
}