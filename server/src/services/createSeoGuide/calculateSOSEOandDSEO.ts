type OptimizationZone =
  | 'Sub-optimized'
  | 'Standard-optimized'
  | 'Strong-optimized'
  | 'Over-optimized';

type OptimizationRanges = {
  subOptimized: number;
  standardOptimized: number;
  strongOptimized: number;
};

const zoneWeight: Record<OptimizationZone, number> = {
  'Sub-optimized': 0.5,
  'Standard-optimized': 1.0,
  'Strong-optimized': 1.5,
  'Over-optimized': 2.0,
};

const getZone = (
  value: number,
  ranges: OptimizationRanges
): OptimizationZone => {
  const s = ranges.subOptimized;
  const std = s + ranges.standardOptimized;
  const strong = std + ranges.strongOptimized;

  if (value < s) return 'Sub-optimized';
  if (value < std) return 'Standard-optimized';
  if (value < strong) return 'Strong-optimized';
  return 'Over-optimized';
};

export function calculateSoseoAndDseo(
  myDoc: string[],
  keywordOptimizations: {
    keyword: string;
    optimizationRanges: OptimizationRanges;
  }[]
): { soseo: number; dseo: number } {
  let totalWeight = 0;
  let overCount = 0;
  const cleanedDoc = myDoc.map(word =>
    word.toLowerCase().replace(/[^\w\s]/g, '')
  );

  for (const { keyword, optimizationRanges } of keywordOptimizations) {
    const freq =
      cleanedDoc.filter(w => w === keyword.toLowerCase()).length /
      cleanedDoc.length;

    const logValue = Math.log10(freq + 1);
    const zone = getZone(logValue, optimizationRanges);
    const weight = zoneWeight[zone];

    totalWeight += weight;
    if (zone === 'Over-optimized') overCount++;
  }

  const total = keywordOptimizations.length;
  const soseo = (totalWeight / total) * 100;
  const dseo = (overCount / total) * 200;

  return {
    soseo: Math.round(soseo * 10) / 10, // Round to 1 decimal place
    dseo: Math.round(dseo * 10) / 10,
  };
}
