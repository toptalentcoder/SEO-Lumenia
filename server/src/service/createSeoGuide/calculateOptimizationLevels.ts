type KeywordCounts = Record<string, number>;
type KeywordDistributions = KeywordCounts[];
type OptimizationRanges = {
    name : string;
    subOptimized: string;
    standardOptimized: string;
    strongOptimized: string;
    overOptimized: string;
};
type OptimizationLevels = OptimizationRanges[];

/**
 * Calculates optimization levels for each keyword across multiple documents
 * using statistical thresholds (mean ± std deviation).
 */
export function calculateOptimizationLevels(
    keywordDistributions: KeywordDistributions
): OptimizationLevels {
    const keywordStats: Record<string, number[]> = Object.create(null);

    // Group frequencies for each keyword
    for (let i = 0; i < keywordDistributions.length; i++) {
        const keywordCounts = keywordDistributions[i];
        for (const keyword in keywordCounts) {
            if (!keywordStats[keyword]) keywordStats[keyword] = [];
            keywordStats[keyword].push(keywordCounts[keyword]);
        }
    }

    const optimizationLevels: OptimizationLevels = [];

    for (const keyword in keywordStats) {
        const frequencies = keywordStats[keyword];
        const len = frequencies.length;

        // Fast mean and std deviation calculation
        let sum = 0, sumSquares = 0;
        for (let i = 0; i < len; i++) {
            const f = frequencies[i];
            sum += f;
            sumSquares += f * f;
        }

        const mean = sum / len;
        const stdDev = Math.sqrt((sumSquares - (sum * sum) / len) / len);

        // Compute optimization thresholds
        const subMax = mean - 0.5 * stdDev;
        const stdMin = mean - 0.5 * stdDev;
        const stdMax = mean + 0.5 * stdDev;
        const strongMin = stdMax;
        const strongMax = mean + 1.5 * stdDev;
        const overMin = strongMax;
        const overMax = mean + 2.5 * stdDev;

        optimizationLevels.push({
            name : keyword,
            subOptimized: `${Math.round(subMax)}`,
            standardOptimized: `${Math.round(stdMax) - Math.round(stdMin)}`,
            strongOptimized: `${Math.round(strongMax) - Math.round(strongMin)}`,
            overOptimized: `${Math.round(overMax) - Math.round(overMin)}`
        });
    }

    return optimizationLevels;
}
