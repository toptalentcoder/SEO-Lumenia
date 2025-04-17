import * as cheerio from 'cheerio';

export function discoverInternalLinks(html: string, base: string): string[] {
    const $ = cheerio.load(html);
    const found = new Set<string>();

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        let absUrl = '';
        if (href.startsWith('/')) absUrl = new URL(href, base).href;
        else if (href.startsWith(base)) absUrl = href;
        else return;

        absUrl = absUrl.split('#')[0].replace(/\/$/, '');
        if (absUrl.startsWith(base)) found.add(absUrl);
    });

    return [...found];
}