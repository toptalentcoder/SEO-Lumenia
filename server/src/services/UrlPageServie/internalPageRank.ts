import * as cheerio from 'cheerio';
import { getOrFetchInternalUrls } from './getOrFetchInternalPageUrls';
import { fetchHTML } from './fetchHtml';
import { Payload } from 'payload';

function extractWeightedLinks(html: string, base: string): Record<string, number> {
    const $ = cheerio.load(html);
    const counts: Record<string, number> = {};

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

            const clean = absUrl.split('#')[0].replace(/\/$/, '');
            if (clean.startsWith(base)) counts[clean] = (counts[clean] || 0) + weight;
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

export async function internalPageRank(baseUrl: string, payload : Payload) {
    const { urls, rootHTML } = await getOrFetchInternalUrls(baseUrl, payload);
    const html = rootHTML || await fetchHTML(baseUrl);
    if (!html) return [];

    const counts = extractWeightedLinks(html, baseUrl);
    const htmlResults = await Promise.allSettled(urls.map(link => fetchHTML(link)));

    for (const result of htmlResults) {
        if (result.status === 'fulfilled' && result.value) {
            const moreLinks = extractWeightedLinks(result.value, baseUrl);
            for (const [url, count] of Object.entries(moreLinks)) {
                counts[url] = (counts[url] || 0) + count;
            }
        }
    }

    return normalizeScores(counts, baseUrl);
}
