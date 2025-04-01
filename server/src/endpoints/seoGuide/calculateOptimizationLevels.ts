import { withErrorHandling } from "@/middleware/errorMiddleware";
import { processText } from "@/services/createSeoGuide/processText";
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

export const calculateOptimizationLevels: Endpoint = {
  path: "/calculate_optimization_levels",
  method: "post",

  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
    if (!req.json) {
      return new Response(
        JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
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
    const urls = ["current"];
    const docs = [tokens];

    const optimizationResults = calculateDynamicOptimization(urls, docs, keywords);

    const result = optimizationResults.map(opt => ({
      keyword: opt.keyword,
      value: opt.urlOptimizations["current"] * 20 || 0,
      ranges: opt.optimizationRanges
    }));

    return new Response(
      JSON.stringify({ success: true, keywordOptimizations: result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  })
};
