type OptimizationRanges = {
    name: string;
    subOptimized: number;
    standardOptimized: number;
    strongOptimized: number;
    overOptimized: number;
};

type KeywordOptimization = {
    keyword: string;
    urlOptimizations: Record<string, number>;
    optimizationRanges: OptimizationRanges;
};

// Log smoothing using softmax-like scaling (0–1 range)
const smoothNormalize = (frequencies: number[]): number[] => {
    const logFreqs = frequencies.map(f => Math.log10(f + 1));
    const min = Math.min(...logFreqs);
    const max = Math.max(...logFreqs);

    // Optional: Apply extra smoothing to reduce peaks
    const scaled = logFreqs.map(f => (f - min) / (max - min || 1));
    const adjusted = scaled.map(x => 0.6 + 0.4 * x); // compress range to [0.6, 1]
    return adjusted;
};

// Get percentile
const getPercentile = (sorted: number[], p: number): number => {
    const index = Math.floor(p * sorted.length);
    return sorted[Math.min(index, sorted.length - 1)];
};

const calculateDynamicRanges = (smoothedFreqs: number[]): OptimizationRanges => {
    const sorted = [...smoothedFreqs].sort((a, b) => a - b);

    const p50 = getPercentile(sorted, 0.3);
    const p70 = getPercentile(sorted, 0.8);
    const p85 = getPercentile(sorted, 1);
    const p95 = getPercentile(sorted, 1.15);

    // const minBand = 0.01;

    return {
        name: '',
        subOptimized: p50 * 10000,
        standardOptimized: (p70 - p50) * 10000,
        strongOptimized: (p85 - p70) * 10000,
        overOptimized: (p95 - p85) * 10000
    };
};

export const calculateDynamicOptimizationRanges = (
    urls: string[],
    processedDocs: string[][],
    keywords: string[]
): KeywordOptimization[] => {
    const result: KeywordOptimization[] = [];

    for (const keyword of keywords) {
        const freqs: number[] = [];

        urls.forEach((_, index) => {
            const doc = processedDocs[index];
            if (!doc || doc.length === 0) {
                freqs.push(0);
                return;
            }

            const cleanedDoc = doc.map(word => word.toLowerCase().replace(/[^\w\s]/g, ''));
            const count = cleanedDoc.filter(w => w === keyword.toLowerCase()).length;
            const freq = count / cleanedDoc.length;
            freqs.push(freq);
        });

        const smoothed = smoothNormalize(freqs);
        const ranges = calculateDynamicRanges(smoothed);
        ranges.name = keyword;

        const urlOptimizations: Record<string, number> = {};
        urls.forEach((url, i) => {
            urlOptimizations[url] = smoothed[i] * 10000;
        });

        result.push({
            keyword,
            urlOptimizations,
            optimizationRanges: ranges,
        });
    }

    return result;
};