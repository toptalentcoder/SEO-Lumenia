import { Endpoint } from 'payload';
import { withErrorHandling } from '@/middleware/errorMiddleware';
import { PayloadRequest } from 'payload';

export const calculateSoseoDseoEndpoint: Endpoint = {
  path: '/calculate_soseo_dseo',
  method: 'post',
  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
    const body = req.json ? await req.json() : {};
    const { keywords, processedDocs } = body;

    if (!Array.isArray(keywords) || !Array.isArray(processedDocs)) {
      return new Response(JSON.stringify({ error: 'Invalid input parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const contentWords = processedDocs[0].map((word: string) =>
        word.toLowerCase().replace(/[^\w\s]/g, '')
      );

      const soseo = computeSOSEO(keywords, contentWords);
      const dseo = computeDSEO(keywords, contentWords);

      return new Response(
        JSON.stringify({ success: true, soseo: [soseo], dseo: [dseo] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('❌ Failed to calculate SOSEO/DSEO:', err);
      return new Response(JSON.stringify({ error: 'Calculation failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
};

function computeSOSEO(keywords: string[], contentWords: string[]): number {
  const wordCount = contentWords.length;
  const frequencies = keywords.map(keyword => {
    const count = contentWords.filter(w => w === keyword.toLowerCase()).length;
    return wordCount > 0 ? count / wordCount : 0;
  });

  const logFreqs = frequencies.map(f => Math.log10(f + 1));
  const min = Math.min(...logFreqs);
  const max = Math.max(...logFreqs);
  const normalized = logFreqs.map(f => (f - min) / (max - min || 1));
  const average = normalized.reduce((a, b) => a + b, 0) / normalized.length;

  return Math.min(Math.round(average * 300), 300);
}

function computeDSEO(keywords: string[], contentWords: string[]): number {
  const wordCount = contentWords.length;
  const overOptimizedCount = keywords.filter(keyword => {
    const count = contentWords.filter(w => w === keyword.toLowerCase()).length;
    const freq = wordCount > 0 ? count / wordCount : 0;
    return freq > 0.025; // > 2.5% is considered over-optimized
  }).length;

  return Math.round((overOptimizedCount / keywords.length) * 100);
}
