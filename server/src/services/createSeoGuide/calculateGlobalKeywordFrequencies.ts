<<<<<<< HEAD
// Function to calculate global keyword frequencies
export const calculateGlobalKeywordFrequencies = (keywords: string[], processedDocs: string[][]): Record<string, number> => {
    const keywordFrequencies: Record<string, number> = {};

    // Loop over each processed document and count keyword occurrences
    processedDocs.forEach(doc => {
        doc.forEach(word => {
            if (keywords.includes(word)) {
                keywordFrequencies[word] = (keywordFrequencies[word] || 0) + 1;
            }
        });
    });

    return keywordFrequencies;
};
=======
export function calculateGlobalKeywordFrequencies(
    k_i: number,
    keyword: string,
    semanticKeywords: string[],
    allKeywordCounts: number[]
  ): number {
    const totalUsed = allKeywordCounts.reduce((a, b) => a + b, 0);
    if (totalUsed === 0) return 0;
  
    if (k_i === 0) {
      const density = allKeywordCounts.filter(k => k > 0).length / allKeywordCounts.length;
      return parseFloat((0.1 + 0.4 * density).toFixed(4));
    }
  
    const sumOthers = allKeywordCounts.reduce((sum, val, idx) => {
      return semanticKeywords[idx] === keyword ? sum : sum + val;
    }, 0);
  
    const ratio = k_i / (sumOthers || 1);
    const value = Math.log2(1 + k_i) + Math.log2(1 + ratio);
    return parseFloat(value.toFixed(4));
}
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
