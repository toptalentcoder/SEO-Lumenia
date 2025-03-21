import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Fetch OpenAI embeddings for a given input string
 */
async function getEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });

    const embedding = response?.data?.[0]?.embedding;
    if (!embedding) {
        throw new Error(`Failed to retrieve embedding for input: ${text}`);
    }

    return embedding;
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
