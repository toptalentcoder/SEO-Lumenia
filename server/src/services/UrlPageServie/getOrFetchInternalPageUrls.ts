
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
        return {
            urls: existing.docs[0].urls.map((u: { url: string }) => u.url),
        };
    }

    const rootHTML = await fetchHTML(baseUrl);
    if (!rootHTML) return { urls: [] };

    const urls = discoverInternalLinks(rootHTML, baseUrl);

    await payload.create({
        collection: 'internal-url',
        data: {
            baseUrl,
            urls: urls.map(url => ({ url })),
            fetchedAt: new Date().toISOString(),
        },
    });

    return { urls, rootHTML };
}
