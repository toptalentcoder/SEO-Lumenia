// utils/calculateBulkSoseoDseo.ts

export const computeSOSEO = (keywords: string[], contentWords: string[]): number => {
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
  };
  
  export const computeDSEO = (keywords: string[], contentWords: string[]): number => {
    const wordCount = contentWords.length;
    const overOptimizedCount = keywords.filter(keyword => {
      const count = contentWords.filter(w => w === keyword.toLowerCase()).length;
      const freq = wordCount > 0 ? count / wordCount : 0;
      return freq > 0.025; // > 2.5% is considered over-optimized
    }).length;
  
    return Math.round((overOptimizedCount / keywords.length) * 100);
  };
  
  export const calculateSoseoDseoForAllDocs = (keywords: string[], docs: string[][]): { soseoScores: number[]; dseoScores: number[] } => {
    const soseoScores: number[] = [];
    const dseoScores: number[] = [];
  
    for (const doc of docs) {
      const cleaned = doc.map(w => w.toLowerCase().replace(/[\W_]+/g, ''));
      soseoScores.push(computeSOSEO(keywords, cleaned));
      dseoScores.push(computeDSEO(keywords, cleaned));
    }
  
    return { soseoScores, dseoScores };
  };
  