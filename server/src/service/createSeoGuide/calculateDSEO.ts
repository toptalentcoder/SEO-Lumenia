
type KeywordCounts = Record<string, number>;
type KeywordDistributions = KeywordCounts[];


/**
 * Calculates the SEO Danger Score (DSEO) for a given URL.
 * This score evaluates the risk of over-optimization based on keyword frequencies.
 */
export function calculateDSEOForURL(keywordDistributions: KeywordDistributions): number {
    let totalFrequency = 0;
    let totalSquaredFrequency = 0;
    let keywordCount = 0;

    // Calculate frequency statistics for DSEO
    for (let i = 0; i < keywordDistributions.length; i++) {
        const keywordCounts = keywordDistributions[i];
        for (const keyword in keywordCounts) {
            const frequency = keywordCounts[keyword];
            totalFrequency += frequency;
            totalSquaredFrequency += frequency * frequency;
            keywordCount++;
        }
    }

    const meanFrequency = totalFrequency / keywordCount;
    const stdDeviation = Math.sqrt((totalSquaredFrequency / keywordCount) - (meanFrequency * meanFrequency));

    let dseoScore = 0;
    for (let i = 0; i < keywordDistributions.length; i++) {
        const keywordCounts = keywordDistributions[i];
        for (const keyword in keywordCounts) {
            const frequency = keywordCounts[keyword];
            if (frequency > meanFrequency + 2 * stdDeviation) {
                // Over-optimization detected
                dseoScore += 10;
            }
        }
    }

    return Math.min(dseoScore, 200);  // Cap at 200% for the upper bound
}