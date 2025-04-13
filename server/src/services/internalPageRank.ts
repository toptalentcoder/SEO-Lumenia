import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.cnet.com';
const MAX_PAGES = 50;
const DAMPING_FACTOR = 0.85;
const ITERATIONS = 20;

const visited = new Set<string>();
const linkGraph: Record<string, string[]> = {};

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url, { timeout: 8000 });
    return res.data;
  } catch {
    return null;
  }
}

function extractInternalLinks(html: string, currentUrl: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let absUrl: string;
    if (href.startsWith('/')) absUrl = new URL(href, BASE_URL).href;
    else if (href.startsWith(BASE_URL)) absUrl = href;
    else return;

    const clean = absUrl.split('#')[0].replace(/\/$/, '');
    links.add(clean);
  });

  return Array.from(links);
}

async function crawl(url: string) {
  if (visited.size >= MAX_PAGES || visited.has(url)) return;

  visited.add(url);
  const html = await fetchHTML(url);
  if (!html) return;

  const links = extractInternalLinks(html, url);
  linkGraph[url] = links;

  for (const link of links) {
    if (!visited.has(link)) {
      await crawl(link);
    }
  }
}

function calculatePageRank(graph: Record<string, string[]>) {
  const pages = Object.keys(graph);
  const N = pages.length;
  const rank: Record<string, number> = {};
  const temp: Record<string, number> = {};

  pages.forEach(url => (rank[url] = 1 / N));

  for (let i = 0; i < ITERATIONS; i++) {
    for (const url of pages) {
      let sum = 0;
      for (const other of pages) {
        if (graph[other].includes(url)) {
          sum += rank[other] / graph[other].length;
        }
      }
      temp[url] = (1 - DAMPING_FACTOR) / N + DAMPING_FACTOR * sum;
    }
    pages.forEach(url => (rank[url] = temp[url]));
  }

  return rank;
}

function normalizeToYourTextGuruStyle(rawScores: Record<string, number>) {
  const values = Object.values(rawScores);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const results = Object.entries(rawScores).map(([url, raw]) => {
    const score = 90 + 10 * (Math.log10(raw) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
    return {
      url,
      raw,
      score: Math.round(score * 100) / 100,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

export async function internalPageRankYourTextGuru(): Promise<{ url: string; raw: number; score: number }[]> {
  await crawl(BASE_URL);
  const raw = calculatePageRank(linkGraph);
  return normalizeToYourTextGuruStyle(raw);
}
