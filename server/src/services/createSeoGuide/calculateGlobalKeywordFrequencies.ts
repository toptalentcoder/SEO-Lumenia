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
