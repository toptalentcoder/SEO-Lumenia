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

    const sub = get10thPercentile(logFreqs);
    const max = Math.max(...logFreqs, sub);
    const gap = Math.max(max - sub, 1); // ensure enough range for graph bands

    rawSubs.push(sub);
    rawGaps.push(gap);
    urlOptMap.push(urlOptimizations);
  }

  const smoothedSubs = smoothMovingAvg(rawSubs, 5);
  const smoothedGaps = smoothMovingAvg(rawGaps, 5);

  const optimizationLevels = semanticKeywords.map((keyword, i) => {
    const sub = smoothedSubs[i];
    const gap = smoothedGaps[i];
    const raw = urlOptMap[i];

    const normalizedOpt: Record<string, number> = {};
    for (const url in raw) {
      const value = raw[url] ?? 0;
      // Normalize so 0 = subOptimized, 0.2 = standard, 0.4 = strong, 0.6 = over
      const norm = Math.max(0, (value - sub) / gap);

      normalizedOpt[url] = parseFloat(norm.toFixed(4));
    }

    return {
      keyword,
      urlOptimizations: normalizedOpt,
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

// Percentile fallback
function get10thPercentile(values: number[]): number {
  const sorted = values.filter(v => v > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return 0.3;
  const idx = Math.floor(sorted.length * 0.1);
  return sorted[Math.min(idx, sorted.length - 1)];
}

// Smooth transitions for graph thresholds
function smoothMovingAvg(arr: number[], windowSize = 5): number[] {
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
