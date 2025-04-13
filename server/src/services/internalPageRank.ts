import axios from 'axios';
import * as cheerio from 'cheerio';

const TIMEOUT = 8000;

async function fetchHTML(url: string): Promise<string | null> {
    try {
        const res = await axios.get(url, { timeout: TIMEOUT });
        return res.data;
    } catch {
        return null;
    }
}

function extractWeightedLinks(html: string, base: string): Record<string, number> {
    const $ = cheerio.load(html);
    const counts: Record<string, number> = {};

    const add = (url: string, weight = 1) => {
        const clean = url.split('#')[0].replace(/\/$/, '');
        if (clean.startsWith(base)) {
            counts[clean] = (counts[clean] || 0) + weight;
        }
    };

    const selectors: [string, number][] = [
        ['nav a[href]', 3],
        ['header a[href]', 3],
        ['main a[href]', 2],
        ['section a[href]', 2],
        ['footer a[href]', 1],
        ['a[href]', 1],
    ];

    for (const [selector, weight] of selectors) {
        $(selector).each((_, el) => {
            const href = $(el).attr('href');
            if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            let absUrl = '';
            if (href.startsWith('/')) absUrl = new URL(href, base).href;
            else if (href.startsWith(base)) absUrl = href;
            else return;

            add(absUrl, weight);
        });
    }

    return counts;
}

function normalizeScores(counts: Record<string, number>, base: string): { url: string; score: number }[] {
    const root = base.replace(/\/$/, '');
    const others = Object.entries(counts).filter(([url]) => url !== root);

    const max = Math.max(...others.map(([, c]) => c), 1);

    const results = others.map(([url, count]) => ({
        url,
        score: Math.round((count / max) * 90 + 10),
    }));

    results.push({ url: root, score: 100 });

    return results.sort((a, b) => b.score - a.score).slice(0, 100);
}

export async function internalPageRank(baseUrl: string) {
    const rootHTML = await fetchHTML(baseUrl);
    if (!rootHTML) return [];

    const counts = extractWeightedLinks(rootHTML, baseUrl);
    const firstLevelLinks = Object.keys(counts);

    const htmlResults = await Promise.allSettled(firstLevelLinks.map(link => fetchHTML(link)));

    for (let i = 0; i < htmlResults.length; i++) {
        const result = htmlResults[i];
        if (result.status === 'fulfilled' && result.value) {
            const moreLinks = extractWeightedLinks(result.value, baseUrl);
            for (const [url, count] of Object.entries(moreLinks)) {
                counts[url] = (counts[url] || 0) + count;
            }
        }
    }

    return normalizeScores(counts, baseUrl);
}
