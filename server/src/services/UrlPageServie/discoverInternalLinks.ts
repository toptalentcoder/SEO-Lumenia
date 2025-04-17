import * as cheerio from 'cheerio';

export function discoverInternalLinks(html: string, base: string): string[] {
    const $ = cheerio.load(html);
    const found = new Set<string>();

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        try {
            const absUrl = new URL(href, base).href;
            const clean = absUrl.split('#')[0].replace(/\/$/, '');
            if (clean.startsWith(base)) {
                found.add(clean);
            }
        } catch {
            // ignore invalid URLs
        }
    });

    return [...found];
}