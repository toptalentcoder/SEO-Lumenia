import { withErrorHandling } from "@/middleware/errorMiddleware";
import { processText } from "@/services/createSeoGuide/processText";
<<<<<<< HEAD
import { Endpoint, PayloadRequest } from "payload";

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

// Helper: Smooth normalization (log-based, scaled)
const smoothNormalize = (frequencies: number[]): number[] => {
  const logFreqs = frequencies.map(f => Math.log10(f + 1));
  const min = Math.min(...logFreqs);
  const max = Math.max(...logFreqs);
  const scaled = logFreqs.map(f => (f - min) / (max - min || 1));
  return scaled.map(x => 0.6 + 0.4 * x); // compress range [0.6, 1]
};

// Helper: Percentile calculation
const getPercentile = (sorted: number[], p: number): number => {
  const index = Math.floor(p * sorted.length);
  return sorted[Math.min(index, sorted.length - 1)];
};

// Embedded dynamic optimizer
const calculateDynamicOptimization = (
  urls: string[],
  docs: string[][],
  keywords: string[]
): KeywordOptimization[] => {
  const result: KeywordOptimization[] = [];

  for (const keyword of keywords) {
    const freqs: number[] = [];

    urls.forEach((_, index) => {
      const doc = docs[index];
      if (!doc || doc.length === 0) {
        freqs.push(0);
        return;
      }

      const cleanedDoc = doc.map(w => w.toLowerCase().replace(/[^\w\s]/g, ''));
      const count = cleanedDoc.filter(w => w === keyword.toLowerCase()).length;
      const freq = count / cleanedDoc.length;
      freqs.push(freq);
    });

    let smoothed: number[];
    let ranges: OptimizationRanges;

    if (freqs.length === 1) {
      // Fallback for editor-only mode
      smoothed = freqs;
      ranges = {
        name: keyword,
        subOptimized: 0.5,
        standardOptimized: 0.7,
        strongOptimized: 1.2,
        overOptimized: 2.0
      };
    } else {
      smoothed = smoothNormalize(freqs);
      const sorted = [...smoothed].sort((a, b) => a - b);
      ranges = {
        name: keyword,
        subOptimized: getPercentile(sorted, 0.5) * 1000,
        standardOptimized: getPercentile(sorted, 0.1) * 1000,
        strongOptimized: getPercentile(sorted, 0.07) * 1000,
        overOptimized: getPercentile(sorted, 0.05) * 1000
      };
    }

    const urlOptimizations: Record<string, number> = {};
    urls.forEach((url, i) => {
      urlOptimizations[url] = smoothed[i] * 1000;
    });

    result.push({
      keyword,
      urlOptimizations,
      optimizationRanges: ranges
    });
  }

  return result;
};
=======
import { calculateGlobalKeywordFrequencies } from "@/services/createSeoGuide/calculateGlobalKeywordFrequencies";
import { Endpoint, PayloadRequest } from "payload";

// Helper: percentile smoothing
function get10thPercentile(values: number[]): number {
  const sorted = values.filter(v => v > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return 0.3;
  const idx = Math.floor(sorted.length * 0.1);
  return sorted[Math.min(idx, sorted.length - 1)];
}

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
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

export const calculateOptimizationLevels: Endpoint = {
  path: "/calculate_optimization_levels",
  method: "post",

  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
    if (!req.json) {
      return new Response(
<<<<<<< HEAD
        JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
=======
        JSON.stringify({ error: "Invalid request: Missing JSON parser" }),
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { currentText, keywords }: { currentText: string[]; keywords: string[] } = body;

    if (!currentText || !keywords) {
      return new Response(
        JSON.stringify({ error: "Missing currentText or keywords" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const joined = currentText.join(" ");
    const tokens = processText(joined);
<<<<<<< HEAD
    const urls = ["current"];
    const docs = [tokens];

    const optimizationResults = calculateDynamicOptimization(urls, docs, keywords);

    const result = optimizationResults.map(opt => ({
      keyword: opt.keyword,
      value: opt.urlOptimizations["current"] * 20 || 0,
      ranges: opt.optimizationRanges
    }));
=======
    const lowerTokens = tokens.map(t => t.toLowerCase());

    const allKeywordCounts = keywords.map(k =>
      lowerTokens.filter(t => t === k.toLowerCase()).length
    );

    const rawValues = keywords.map((keyword, i) =>
      calculateGlobalKeywordFrequencies(
        allKeywordCounts[i],
        keyword,
        keywords,
        allKeywordCounts
      )
    );

    const sub = get10thPercentile(rawValues);
    const max = Math.max(...rawValues, sub);
    const gap = Math.max(max - sub, 1);

    const smoothedSubs = smoothMovingAvg(Array(keywords.length).fill(sub), 5);
    const smoothedGaps = smoothMovingAvg(Array(keywords.length).fill(gap), 5);

    const result = keywords.map((keyword, i) => {
      const norm = Math.max(0, (rawValues[i] - smoothedSubs[i]) / smoothedGaps[i]);

      return {
        keyword,
        value: parseFloat(norm.toFixed(4)),
        ranges: {
          name: keyword,
          subOptimized: 0,
          standardOptimized: 0.2,
          strongOptimized: 0.4,
          overOptimized: 0.6
        }
      };
    });
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

    return new Response(
      JSON.stringify({ success: true, keywordOptimizations: result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  })
};
