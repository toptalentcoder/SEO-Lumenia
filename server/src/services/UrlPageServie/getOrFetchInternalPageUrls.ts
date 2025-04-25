import { fetchHTML } from './fetchHtml';
import { discoverInternalLinks } from './discoverInternalLinks';
import { Payload } from 'payload';

export async function getOrFetchInternalUrls(baseUrl: string, payload : Payload): Promise<{ urls: string[], rootHTML?: string }> {
    const existing = await payload.find({
        collection: 'internal-url',
        where: { baseUrl: { equals: baseUrl } },
        limit: 1,
    });

    if (existing.docs.length) {
        console.log('[INFO] Found internal URLs in cache for:', baseUrl);
        return {
            urls: existing.docs[0].urls?.map((u: { url: string }) => u.url) ?? [],
        };
    }

    const rootHTML = await fetchHTML(baseUrl);
    console.log('[DEBUG] HTML fetched:', !!rootHTML, baseUrl);

    if (!rootHTML) {
        console.warn('[WARN] Failed to fetch HTML for:', baseUrl);
        return { urls: [] };
    }

    const urls = discoverInternalLinks(rootHTML, baseUrl);
    console.log('[DEBUG] Discovered internal links:', urls.length, urls.slice(0, 10));

    try {
        await payload.create({
            collection: 'internal-url',
            data: {
                baseUrl,
                urls: urls.map(url => ({ url })),
                fetchedAt: new Date().toISOString(),
            },
        });
        console.log('[INFO] Internal URLs saved to DB for:', baseUrl);
    } catch (err) {
        console.error('[ERROR] Failed to save internal URLs:', err);
    }


    return { urls, rootHTML };
}
