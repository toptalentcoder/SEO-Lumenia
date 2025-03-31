import { calculateDynamicOptimizationRanges } from "./assignOptimizationLevel";
import { calculateGlobalKeywordFrequencies } from "./calculateGlobalKeywordFrequencies";

export const calculateSOSEO = (keywords: string[], urls: string[], processedDocs: string[][]): number[] => {
    const globalKeywordFrequencies = calculateGlobalKeywordFrequencies(keywords, processedDocs);
    const keywordOptimizations = calculateDynamicOptimizationRanges(urls, processedDocs, keywords);

    return keywordOptimizations.map(keywordOptimization => {
        const urlOptimizations = Object.values(keywordOptimization.urlOptimizations);

        // Calculate the total frequency of the keyword across all URLs
        const totalFrequency = urlOptimizations.reduce((acc, freq) => acc + freq, 0);

        // Calculate the average frequency of the keyword across all URLs
        const avgFrequency = totalFrequency / urlOptimizations.length;

        // Find the maximum frequency for normalization
        const maxFrequency = Math.max(...urlOptimizations);

        // Get the optimization level for the keyword (from calculateDynamicOptimizationRanges)
        const optimizationLevel = keywordOptimization.optimizationRanges.strongOptimized;

        // Normalize the frequency relative to the highest frequency observed and adjust by optimization level
        const normalizedFrequency = (avgFrequency / maxFrequency) * optimizationLevel;

        // Use a scale from 0 to 300 to normalize the score
        const score = Math.min(Math.max(normalizedFrequency, 0), 300);

        return score;
    });
};
