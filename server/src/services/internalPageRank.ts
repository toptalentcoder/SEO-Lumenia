import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://wilmington-services.co.uk/';

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url, { timeout: 10000 });
    return res.data;
  } catch {
    return null;
  }
}

function extractWeightedLinks(html: string): Record<string, number> {
  const $ = cheerio.load(html);
  const counts: Record<string, number> = {};

  function add(url: string, weight = 1) {
    const cleanUrl = url.split('#')[0].replace(/\/$/, '');
    counts[cleanUrl] = (counts[cleanUrl] || 0) + weight;
  }

  const weightBySelector: [string, number][] = [
    ['nav a[href]', 3],
    ['header a[href]', 3],
    ['main a[href]', 2],
    ['section a[href]', 2],
    ['footer a[href]', 1],
    ['a[href]', 1],
  ];

  for (const [selector, weight] of weightBySelector) {
    $(selector).each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      let absUrl = '';
      if (href.startsWith('/')) absUrl = new URL(href, BASE_URL).href;
      else if (href.startsWith(BASE_URL)) absUrl = href;
      else return;

      add(absUrl, weight);
    });
  }

  return counts;
}

function normalizeScores(counts: Record<string, number>): { url: string; score: number }[] {
  const entries = Object.entries(counts);
  const root = BASE_URL.replace(/\/$/, '');
  const rootCount = counts[root] || 0;

  const others = entries.filter(([url]) => url !== root);
  const values = others.map(([, count]) => count);
  const max = Math.max(...values, 1);

  const scored = others.map(([url, count]) => ({
    url,
    score: Math.round((count / max) * 90 + 10), // 10–99 scaling
  }));

  scored.push({ url: root, score: 100 });

  return scored.sort((a, b) => b.score - a.score).slice(0, 100);
}

export async function internalPageRankYourTextGuru() {
  const html = await fetchHTML(BASE_URL);
  if (!html) return [];

  const weightedCounts = extractWeightedLinks(html);
  const scored = normalizeScores(weightedCounts);

  return scored;
}
