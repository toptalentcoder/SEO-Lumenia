import { TfIdf } from 'natural';

type Document = string[];

/**
 * Extracts top N words across documents using cumulative TF-IDF scoring.
 * @param documents - Tokenized documents (each is an array of words)
 * @param topN - Number of top words to return
 * @returns Array of top N keywords
 */
export const extractWords = (documents: Document[], topN: number = 100): string[] => {
    const tfidf = new TfIdf();

    // Add documents to the TF-IDF model
    for (let i = 0; i < documents.length; i++) {
        tfidf.addDocument(documents[i].join(" "));
    }

    const wordScores = new Map<string, number>();

    for (let i = 0; i < documents.length; i++) {
        const uniqueWords = new Set(documents[i]); // Avoid duplicate words per doc
        for (const word of uniqueWords) {
            const score = tfidf.tfidf(word, i);

            const normalizedScore = score / documents[i].length; // Normalize the score by total document length

            wordScores.set(word, (wordScores.get(word) || 0) + normalizedScore);
        }
    }

    // Convert to array and sort by score descending
    const sorted = [...wordScores.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([word]) => word);

    return sorted;
};
