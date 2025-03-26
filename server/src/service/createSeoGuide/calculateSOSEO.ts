import { cosineSimilarity, getEmbedding } from "./getSemanticKeywords";

// Calculate Semantic Importance based on embeddings
const calculateSemanticImportance = async (keywords: string[], query: string): Promise<Record<string, number>> => {
    const queryEmbedding = await getEmbedding(query);
    const importance: Record<string, number> = {};

    for (const keyword of keywords) {
        const keywordEmbedding = await getEmbedding(keyword);
        const similarity = cosineSimilarity(queryEmbedding, keywordEmbedding);
        importance[keyword] = similarity * 100; // Scale the similarity to a percentage
    }

    return importance;
};

// Dynamic SOSEO and DSEO Calculation
export const calculateSOSEOandDSEO = async (
    keywordFrequencies: Record<string, number> | null | undefined, // Allow null/undefined
    keywords: string[], 
    content: string, 
    competitorData: { soseo: number, dseo: number }[]
): Promise<{ soseo: number, dseo: number }> => {
    // Default to an empty object if keywordFrequencies is null or undefined
    if (!keywordFrequencies) {
        keywordFrequencies = {};
    }

    const keywordImportance = await calculateSemanticImportance(keywords, content);

    let totalKeywordFrequency = 0;
    let totalImportance = 0;

    // Sum keyword frequencies and their dynamic importance
    for (const [keyword, frequency] of Object.entries(keywordFrequencies)) {
        const importance = keywordImportance[keyword] || 1;
        totalKeywordFrequency += frequency;
        totalImportance += importance;
    }

    // SOSEO: Optimization score based on keyword frequencies and importance
    const soseo = (totalKeywordFrequency / totalImportance) * 100;

    // DSEO: Risk of over-optimization, based on frequency and repetition
    const dseo = totalKeywordFrequency > 10 ? 100 : 50; // Adjust based on your own rules

    // Compare to competitors' data
    const averageCompetitorSOSEO = competitorData.reduce((acc, curr) => acc + curr.soseo, 0) / competitorData.length;
    const averageCompetitorDSEO = competitorData.reduce((acc, curr) => acc + curr.dseo, 0) / competitorData.length;

    return {
        soseo: Math.max(soseo, averageCompetitorSOSEO),
        dseo: Math.min(dseo, averageCompetitorDSEO),
    };
};
