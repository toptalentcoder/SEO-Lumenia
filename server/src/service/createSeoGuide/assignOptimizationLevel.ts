// Helper function to calculate context relevance (differential corpus)
const calculateContextualRelevance = (keywordFrequency: number, globalFrequency: number) => {

    const scaledKeywordFrequency = keywordFrequency * 1000;
    const scaledGlobalFrequency = globalFrequency * 1000;
    // Calculate the differential frequency score
    const diff = scaledKeywordFrequency / scaledGlobalFrequency;  // Higher means keyword is more significant for SEO
    return Math.min(100, Math.max(0, diff * 100));  // Cap between 0 and 100 for simplicity
};

type KeywordOptimization = {
    keyword: string;
    urlOptimizations: Record<string, number>;
    optimizationRanges: {
        name: string;
        subOptimized: number;
        standardOptimized: number;
        strongOptimized: number;
        overOptimized: number;
    };
};

export const calculateDynamicOptimizationRanges = (
    urls: string[],
    processedDocs: string[][],
    keywords: string[],
    globalKeywordFrequencies: Record<string, number> // Precomputed global frequencies for each keyword
): KeywordOptimization[] => {
    const keywordOptimizations: KeywordOptimization[] = [];

    const calculateRanges = (frequencies: number[], globalFrequencies: number[]) => {
        frequencies.sort((a, b) => a - b);

        const maxFrequency = frequencies[frequencies.length - 1];
        const minFrequency = frequencies[0];

        const subOptimizedThreshold = frequencies[Math.floor(frequencies.length * 0.3)] * 1000 || 0;
        const standardOptimizedThreshold = frequencies[Math.floor(frequencies.length * 0.5)] * 1000  || 0;
        const strongOptimizedThreshold = frequencies[Math.floor(frequencies.length * 0.75)] * 1000  || 0;
        const overOptimizedThreshold = frequencies[Math.floor(frequencies.length * 0.9)] * 1000  || 0;;

        // Calculate differential relevance scores
        const diffScores = frequencies.map((frequency, index) => 
            calculateContextualRelevance(frequency, globalFrequencies[index])
        );

        return {
            subOptimized: subOptimizedThreshold,
            standardOptimized: standardOptimizedThreshold,
            strongOptimized: strongOptimizedThreshold,
            overOptimized: overOptimizedThreshold
        };
    };

    keywords.forEach(keyword => {
        const urlOptimizations: Record<string, number> = {};
        const keywordFrequencies: number[] = [];
        const globalFrequencies: number[] = []; // Use global frequencies for each URL

        urls.forEach((url, index) => {
            const doc = processedDocs[index];
            if (!doc || doc.length === 0) {
                urlOptimizations[url] = 0;
                keywordFrequencies.push(0);
                globalFrequencies.push(globalKeywordFrequencies[keyword] || 0); // Use global frequency for comparison
                return;
            }

            const keywordNormalized = keyword.toLowerCase();
            const docNormalized = doc.flat().map(word => word.toLowerCase().replace(/[^\w\s]/g, ''));
            const keywordCount = docNormalized.filter(word => word === keywordNormalized).length;

            const frequency = keywordCount / doc.length;

            urlOptimizations[url] = frequency * 1000;
            keywordFrequencies.push(frequency);
            globalFrequencies.push(globalKeywordFrequencies[keyword] || 0); // Use global frequency for comparison
        });

        const optimizationRanges = calculateRanges(keywordFrequencies, globalFrequencies);

        keywordOptimizations.push({
            keyword,
            urlOptimizations,
            optimizationRanges: {
                name: keyword,
                ...optimizationRanges,
            },
        });
    });

    return keywordOptimizations;
};
