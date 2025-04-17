import axios from 'axios';
import { Payload } from 'payload';
import { getOrFetchInternalUrls } from './getOrFetchInternalPageUrls';
import { cleanContent } from './cleanContent';

function cosineSimilarity(a: string, b: string): number {
    const wordsA = a.split(/\W+/);
    const wordsB = b.split(/\W+/);
    const vocab = new Set([...wordsA, ...wordsB]);

    const vecA = Array.from(vocab).map(word => wordsA.filter(w => w === word).length);
    const vecB = Array.from(vocab).map(word => wordsB.filter(w => w === word).length);

    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val ** 2, 0));

    return magnitudeA && magnitudeB ? (dotProduct / (magnitudeA * magnitudeB)) * 100 : 0;
}

export async function pageDuplicationAnalysis(baseUrl: string, payload: Payload): Promise<void> {
    // ✅ Return early if already exists
    const existing = await payload.find({
        collection: 'page-duplicates',
        where: { baseUrl: { equals: baseUrl } },
        limit: 1,
    });

    if (existing.docs.length) {
        console.log(`🟡 Page duplicates for ${baseUrl} already exist. Skipping analysis.`);
        return;
    }

    // ✅ Continue if not cached
    const { urls } = await getOrFetchInternalUrls(baseUrl, payload);

    const pages = await Promise.all(
        urls.map(async (url) => {
        try {
            const res = await axios.get(url, { timeout: 10000 });
            return { url, content: cleanContent(res.data) };
        } catch {
            return { url, content: '' };
        }
        })
    );

    const duplicates: {
        urlA: string;
        urlB: string;
        score: number;
        status: 'Perfect' | 'OK' | 'Danger';
    }[] = [];

    for (let i = 0; i < pages.length; i++) {
        for (let j = i + 1; j < pages.length; j++) {
        const a = pages[i];
        const b = pages[j];
        if (!a.content || !b.content) continue;

        const score = Math.round(cosineSimilarity(a.content, b.content));
        const status = score >= 85 ? 'Danger' : score >= 50 ? 'OK' : 'Perfect';

        duplicates.push({
            urlA: a.url,
            urlB: b.url,
            score,
            status,
        });
        }
    }

    await payload.create({
        collection: 'page-duplicates',
        data: {
        baseUrl,
        duplicates,
        analyzedAt: new Date().toISOString(),
        },
    });

    console.log(`✅ Page duplication analysis completed for ${baseUrl}`);
}
