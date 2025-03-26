type KeywordOptimization = {
    keyword: string;
    urlOptimizations: Record<string, number>; // Frequency value per URL
    optimizationRanges: {
        name: string;
        subOptimized: string;
        standardOptimized: string;
        strongOptimized: string;
        overOptimized: string;
    };
};

export const calculateDynamicOptimizationRanges = (
    urls: string[],
    processedDocs: string[][],
    keywords: string[]
): KeywordOptimization[] => {
    const keywordOptimizations: KeywordOptimization[] = [];

    // Function to calculate dynamic ranges for each keyword, with smooth adjustments
    const calculateRanges = (frequencies: number[]) => {
        // Sort frequencies in ascending order
        frequencies.sort((a, b) => a - b);

        // Normalize the frequencies to make the distribution smoother
        const maxFrequency = frequencies[frequencies.length - 1];

        // Apply a logarithmic scaling to smooth extreme values (if necessary)
        const normalizedFrequencies = frequencies.map(frequency => {
            // Prevent division by zero and use a small epsilon for low values
            const epsilon = 0.0001;
            const scaledFrequency = Math.log(frequency + epsilon) / Math.log(maxFrequency + epsilon);
            return scaledFrequency;
        });

        const minNorm = Math.min(...normalizedFrequencies);
        const maxNorm = Math.max(...normalizedFrequencies);
        const rangeNorm = maxNorm - minNorm;

        // Calculate the thresholds with smooth adjustments
        const suboptimizedThreshold = minNorm + rangeNorm * 0.6;  // 40% of the normalized range
        const standardoptimizedThreshold = minNorm + rangeNorm * 0.77;  // 70% of the normalized range
        const strongoptimizedThreshold = minNorm + rangeNorm * 0.9;  // 85% of the normalized range
        const overoptimizedThreshold = minNorm + rangeNorm * 1;  // 100% of the normalized range

        return {
            subOptimized: `${((suboptimizedThreshold) * 10000).toFixed(0)}`,
            standardOptimized: `${((standardoptimizedThreshold - suboptimizedThreshold + 0.5) * 10000).toFixed(0)}`,
            strongOptimized: `${((strongoptimizedThreshold - standardoptimizedThreshold + 0.5) * 10000).toFixed(0)}`,
            overOptimized: `${((overoptimizedThreshold - strongoptimizedThreshold + 0.5) * 10000).toFixed(0)}`,
        };
    };

    // Check for matching lengths
    // if (urls.length !== processedDocs.length) {
    //     console.error("Mismatch between the number of URLs and processed documents.");
    //     return [];
    // }

    // Calculate frequency for each keyword across all URLs
    for (const keyword of keywords) {
        const urlOptimizations: Record<string, number> = {};
        const keywordFrequencies: number[] = [];

        // For each URL, count keyword occurrences
        for (const [index, url] of urls.entries()) {
            const doc = processedDocs[index];

            if (!doc || doc.length === 0) {
                console.warn(`Document for URL ${url} is either missing or empty!`);
                urlOptimizations[url] = 0; // Set frequency to 0 if document is invalid
                keywordFrequencies.push(0);
                continue; // Skip to the next URL if the document is missing or empty
            }

            // Normalize and match keyword (case insensitive and without punctuation)
            const keywordNormalized = keyword.toLowerCase();
            const docNormalized = doc.map(word => word.toLowerCase().replace(/[^\w\s]/g, '')); // Strip punctuation
            const keywordCount = docNormalized.filter((word) => word === keywordNormalized).length;

            const frequency = keywordCount / doc.length; // Frequency as percentage of the document
            urlOptimizations[url] = Math.round((frequency + 1) * 10000); // Store frequency per URL, multiplied by 10000
            keywordFrequencies.push(frequency); // Add frequency for dynamic range calculation
        }

        // Calculate dynamic ranges for the keyword based on frequency distribution
        const optimizationRanges = calculateRanges(keywordFrequencies);

        // Add to the result array with the "name" field inside optimizationRanges
        keywordOptimizations.push({
            keyword,
            urlOptimizations,
            optimizationRanges: {
                name: keyword,  // Add the "name" field to the optimizationRanges
                ...optimizationRanges,  // Spread the calculated ranges
            },
        });
    }

    return keywordOptimizations;
};
