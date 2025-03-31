type Document = string[];

/**
 * Extracts top N keywords using TF * Document Frequency scoring.
 * @param documents - Array of tokenized documents (each is an array of words)
 * @param topN - Number of top words to return
 * @returns Array of top N keyword strings
 */
export const extractWords = (documents: Document[], topN: number = 100): string[] => {
    const wordTF = new Map<string, number>();     // Total term frequency across all docs
    const wordDF = new Map<string, number>();     // Document frequency (in how many docs word appears)

    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const wordCount: Record<string, number> = {};
        const uniqueWords = new Set<string>();

        for (const word of doc) {
            wordCount[word] = (wordCount[word] || 0) + 1;
            uniqueWords.add(word);
        }

        for (const word of uniqueWords) {
            wordDF.set(word, (wordDF.get(word) || 0) + 1);
        }

        for (const word in wordCount) {
            const tf = wordCount[word] / doc.length; // Term Frequency (TF)
            wordTF.set(word, (wordTF.get(word) || 0) + tf);
        }
    }

    const keywordScores: [string, number][] = [];

    for (const [word, tf] of wordTF.entries()) {
        const df = wordDF.get(word) || 1;
        const score = tf * df; // Higher if frequent + appears in many docs
        keywordScores.push([word, score]);
    }

    return keywordScores
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([word]) => word);
};
