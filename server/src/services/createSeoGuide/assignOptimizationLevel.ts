import { fetchPageContent } from "./fetchPageContent";
import { processText } from "./processText";

export async function calculateDynamicOptimizationRanges(
  urls: string[],
  semanticKeywords: string[]
) {
  const contents = await Promise.all(urls.map(fetchPageContent));
  const tokenLists = contents.map(content => processText(content || ""));

  const rawSubs: number[] = [];
  const rawGaps: number[] = [];
  const urlOptMap: Record<string, number>[] = [];
  const keywordLogFreqs: number[][] = [];

  // Step 1: collect subs and gaps
  for (const keyword of semanticKeywords) {
    const urlOptimizations: Record<string, number> = {};
    const logFreqs: number[] = [];

    for (let i = 0; i < urls.length; i++) {
      const tokens = tokenLists[i];
      const url = urls[i];
      const count = tokens.filter(t => t === keyword).length;
      const logScore = Math.log10(count + 1);
      const rounded = parseFloat(logScore.toFixed(4));
      urlOptimizations[url] = rounded;
      if (rounded > 0) logFreqs.push(rounded);
    }

    const subRaw = get10thPercentile(logFreqs);
    const max = Math.max(...logFreqs, subRaw);
    const gapRaw = Math.max(max - subRaw, 0.5); // fallback gap

    rawSubs.push(subRaw);
    rawGaps.push(gapRaw);
    urlOptMap.push(urlOptimizations);
    keywordLogFreqs.push(logFreqs);
  }

  // Step 2: smooth subs and gaps globally
  const smoothedSubs = smoothMovingAvg(rawSubs, 5);
  const smoothedGaps = smoothMovingAvg(rawGaps, 5);

  // Step 3: generate final thresholds per keyword
  const optimizationLevels = semanticKeywords.map((keyword, i) => {
    const sub = smoothedSubs[i];
    const gap = smoothedGaps[i];

    return {
      keyword,
      urlOptimizations: urlOptMap[i],
      optimizationRanges: {
        name: keyword,
        subOptimized: parseFloat(sub.toFixed(4)),
        standardOptimized: parseFloat((gap * 0.2).toFixed(4)),
        strongOptimized: parseFloat((gap * 0.2).toFixed(4)),
        overOptimized: parseFloat((gap * 0.2).toFixed(4))
      }
    };
  });

  return optimizationLevels;
}

// Helper: Get 10th percentile (fallback to min)
function get10thPercentile(values: number[]): number {
  const sorted = values.filter(v => v > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return 0.3;
  const idx = Math.floor(sorted.length * 0.1);
  return sorted[Math.min(idx, sorted.length - 1)];
}

// Helper: Moving average smoother
function smoothMovingAvg(arr: number[], windowSize: number = 5): number[] {
  const smoothed: number[] = [];
  const half = Math.floor(windowSize / 2);

  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - half);
    const end = Math.min(arr.length, i + half + 1);
    const slice = arr.slice(start, end);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    smoothed.push(parseFloat(avg.toFixed(4)));
  }

  return smoothed;
}
