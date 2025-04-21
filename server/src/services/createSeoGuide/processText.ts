import { removeStopwords } from 'stopword';
import winkTokenizer from 'wink-tokenizer';

const tokenizer = new winkTokenizer();

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
    const tokens = tokenizer.tokenize(cleanedText)
        .filter(t => t.tag === 'word')
        .map(t => t.value);

    return removeStopwords(tokens);
};
