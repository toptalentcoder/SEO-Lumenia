import * as cheerio from 'cheerio';

export function extractWeightedLinks(html: string, base: string): Record<string, number> {
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