import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_TEXT_EMBEDDING_ADA_002_VERSION, AZURE_OPENAI_DEPLOYMENT_TEXT_EMBEDDING_ADA_002, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from '@/config/apiConfig';

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const options = {
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_API_KEY,
    deploymentName: AZURE_OPENAI_DEPLOYMENT_TEXT_EMBEDDING_ADA_002,
    apiVersion: AZURE_OPENAI_API_TEXT_EMBEDDING_ADA_002_VERSION
};

const openai = new AzureOpenAI(options)

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const normalize = (vec: number[]) => {
        const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
        return magnitude === 0 ? vec : vec.map(val => val / magnitude);
    };

    const normalizedA = normalize(vecA);
    const normalizedB = normalize(vecB);

    return normalizedA.reduce((sum, a, i) => sum + a * normalizedB[i], 0);
}

/**
 * Average multiple embedding vectors into one.
 */
function averageVectors(vectors: number[][]): number[] {
    if (vectors.length === 0) return [];

    const length = vectors[0].length;
    const avg = new Array(length).fill(0);

    for (const vec of vectors) {
        for (let i = 0; i < length; i++) {
            avg[i] += vec[i];
        }
    }

    return avg.map(v => v / vectors.length);
}

/**
 * Split large text into chunks under OpenAI token limit.
 */
function splitTextIntoChunks(text: string, maxWords = 750): string[] {
    const words = text.trim().split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '));
    }

    return chunks;
}

/**
 * Get an embedding for a single text (split if needed and averaged).
 */
export async function getEmbedding(text: string): Promise<number[]> {
    const chunks = splitTextIntoChunks(text);

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: chunks,
        });

        const vectors = response.data.map(item => item.embedding);
        return averageVectors(vectors);
    } catch (err) {
        console.error("Embedding error:", err);
        return [];
    }
}

/**
 * Get semantically related keywords using OpenAI embeddings.
 */
export async function getSemanticKeywords(
    keywords: string[],
    baseQuery: string,
    topN: number = 50,
    threshold: number = 0.7
): Promise<string[]> {
    const baseEmbedding = await getEmbedding(baseQuery);
    if (baseEmbedding.length === 0) return [];

    const keywordBatches = keywords.reduce((batches: string[][], keyword) => {
        const lastBatch = batches[batches.length - 1];
        if (lastBatch && lastBatch.length < 100) {
            lastBatch.push(keyword);
        } else {
            batches.push([keyword]);
        }
        return batches;
    }, []);

    const similarityScores: { keyword: string; similarity: number }[] = [];

    for (const batch of keywordBatches) {
        try {
            const response = await openai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: batch,
            });

            response.data.forEach((item, idx) => {
                const keyword = batch[idx];
                const similarity = cosineSimilarity(baseEmbedding, item.embedding);
                if (similarity >= threshold) {
                    similarityScores.push({ keyword, similarity });
                }
            });
        } catch (err) {
            console.warn("Batch embedding failed:", err);
        }
    }

    return similarityScores
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topN)
        .map(item => item.keyword);
}
