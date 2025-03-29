import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const normalize = (vec: number[]) => {
        const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
        return vec.map(val => val / magnitude);
    };

    const normalizedA = normalize(vecA);
    const normalizedB = normalize(vecB);

    let dot = 0;
    for (let i = 0; i < normalizedA.length; i++) {
        dot += normalizedA[i] * normalizedB[i];
    }
    return dot;
}


const MAX_TOKENS = 8192;  // Maximum tokens for the OpenAI embeddings model

// Function to split the content into smaller chunks
const splitTextIntoChunks = (text: string): string[] => {
    const words = text.split(' ');
    const chunks = [];
    let chunk = '';

    for (let i = 0; i < words.length; i++) {
        if ((chunk + words[i]).length > MAX_TOKENS) {
            chunks.push(chunk);
            chunk = words[i];
        } else {
            chunk += ' ' + words[i];
        }
    }
    if (chunk) chunks.push(chunk);  // Push the last chunk

    return chunks;
};

// Usage in getEmbedding
export async function getEmbedding(text: string): Promise<number[]> {
    const chunks = splitTextIntoChunks(text);  // Split the content into chunks

    let embeddings: number[] = [];

    // Calculate embeddings for each chunk separately
    for (const chunk of chunks) {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: chunk,
        });

        embeddings = embeddings.concat(response.data[0]?.embedding || []);
    }

    return embeddings;  // Return combined embeddings
}

/**
 * Get semantically related keywords using OpenAI embeddings
 * @param keywords Array of keyword strings
 * @param baseQuery A base query string to compare against
 * @param topN How many related keywords to return
 * @param threshold Similarity threshold (0.0–1.0)
 */
export async function getSemanticKeywords(
    keywords: string[],
    baseQuery: string,
    topN: number = 50,
    threshold: number = 0.7
): Promise<string[]> {
    const baseEmbedding = await getEmbedding(baseQuery);
    const keywordSimilarityScores: { keyword: string; similarity: number }[] = [];

    // Fetch embeddings in parallel for better performance
    const embeddingPromises = keywords.map(k => getEmbedding(k));
    const allEmbeddings = await Promise.allSettled(embeddingPromises);

    for (let i = 0; i < allEmbeddings.length; i++) {
        const result = allEmbeddings[i];
        if (result.status === 'fulfilled') {
        const similarity = cosineSimilarity(baseEmbedding, result.value);
        if (similarity >= threshold) {
            keywordSimilarityScores.push({ keyword: keywords[i], similarity });
        }
        }
    }

    // Return top N most similar keywords
    return keywordSimilarityScores
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topN)
        .map(item => item.keyword);
}
