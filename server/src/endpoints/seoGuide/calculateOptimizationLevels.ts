import { withErrorHandling } from "@/middleware/errorMiddleware";
import { processText } from "@/services/createSeoGuide/processText";
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

export const calculateOptimizationLevels: Endpoint = {
  path: "/calculate_optimization_levels",
  method: "post",

  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
    if (!req.json) {
      return new Response(
        JSON.stringify({ error: "Invalid request: Missing JSON parser" }),
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

    return new Response(
      JSON.stringify({ success: true, keywordOptimizations: result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  })
};
