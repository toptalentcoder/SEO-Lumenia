import { calculateDynamicOptimizationRanges } from "./assignOptimizationLevel";
import { calculateGlobalKeywordFrequencies } from "./calculateGlobalKeywordFrequencies";

// Calculate DSEO score (risk of over-optimization) based on keyword frequency
export const calculateDSEO = (keywords: string[], urls: string[], processedDocs: string[][], overOptimizationFactor: number = 1.5): number[] => {
    const globalKeywordFrequencies = calculateGlobalKeywordFrequencies(keywords, processedDocs);
    const keywordOptimizations = calculateDynamicOptimizationRanges(urls, processedDocs, keywords);

    return keywordOptimizations.map(keywordOptimization => {
        const urlOptimizations = Object.values(keywordOptimization.urlOptimizations);

        // Calculate the total frequency of the keyword across all URLs
        const totalFrequency = urlOptimizations.reduce((acc, freq) => acc + freq, 0);

        // Calculate the average frequency of the keyword across all URLs
        const avgFrequency = totalFrequency / urlOptimizations.length;

        // Calculate DSEO score: flag as over-optimized if a document's frequency exceeds the average * factor
        const dseoScores = urlOptimizations.map(frequency => {
            // Flag over-optimization if the frequency is greater than the average frequency * factor
            return frequency > avgFrequency * overOptimizationFactor ? 100 : 0;
        });

        // Return maximum DSEO score across all documents (URLs)
        return Math.max(...dseoScores); // If any document is over-optimized, it gets 100
    });
};

