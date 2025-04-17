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

function buildHistogram(pairs: any[]) {
    const frequencyMap: Record<number, number> = {};

    for (const { score } of pairs) {
        frequencyMap[score] = (frequencyMap[score] || 0) + 1;
    }

    // Create a dense 3–99 histogram
    const histogram = Array.from({ length: 97 }, (_, i) => {
        const score = i + 3;
        return {
            score,
            count: frequencyMap[score] || 0,
        };
    });

    return histogram;
}


function stratifiedSample(pairs: any[], count: number) {
    const danger = pairs.filter(d => d.status === 'Danger');
    const ok = pairs.filter(d => d.status === 'OK');
    const perfect = pairs.filter(d => d.status === 'Perfect');

    const sample = [
        ...danger.slice(0, 33),
        ...ok.slice(0, 33),
        ...perfect.slice(0, 34),
    ].slice(0, count);

    const summary = {
        total: pairs.length,
        danger: danger.length,
        ok: ok.length,
        perfect: perfect.length,
    };

    return { sample, summary };
}

export async function pageDuplicationAnalysis(
    baseUrl: string,
    payload: Payload
): Promise<{ fromCache: boolean; data: any[]; summary: any; histogram : any }> {
    // 1. Check cache
    const existing = await payload.find({
        collection: 'page-duplicates',
        where: { baseUrl: { equals: baseUrl } },
        limit: 1,
    });

    if (existing.docs.length) {
        const cached = existing.docs[0].duplicates;
        const { sample, summary } = stratifiedSample(cached, 100);
        const histogram = buildHistogram(cached);

        return {
            fromCache: true,
            data: sample,
            summary,
            histogram,
        };
    }


    // 2. Fetch internal URLs and contents
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

    // 3. Compare every pair
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

    const { sample, summary } = stratifiedSample(duplicates, 100);

    // 4. Save all results, return only the sample
    await payload.create({
        collection: 'page-duplicates',
        data: {
        baseUrl,
        duplicates,
        analyzedAt: new Date().toISOString(),
        },
    });

    const histogram = buildHistogram(duplicates);

    return {
        fromCache: false,
        data: sample,
        summary,
        histogram,
    };
}
