import { removeStopwords } from 'stopword';
import { WordTokenizer } from 'natural'

const tokenizer = new WordTokenizer();

export const processText = (text: string): string[] => {
    if (!text || typeof text !== 'string' || !text.trim()) {
        console.error("Received undefined or empty text for processing");
        return [];
    }

    // Pre-process and normalize
    const cleanedText = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')       // Remove punctuation
        .replace(/\s+/g, ' ')          // Collapse multiple spaces
        .trim();

    // Tokenize and remove stopwords
    const tokens = tokenizer.tokenize(cleanedText);
    return removeStopwords(tokens);
};
