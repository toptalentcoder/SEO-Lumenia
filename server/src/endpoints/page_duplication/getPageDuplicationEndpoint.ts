import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";

function formatUrl(url: string): string {
    if (!url) return '';
    // Remove any existing protocol
    const cleanUrl = url.replace(/^https?:\/\//, '');
    // Add https:// prefix
    return `https://${cleanUrl}`;
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


export const getPageDuplicationEndpoint: Endpoint = {
    path: "/get-page-duplication",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const body = req.json ? await req.json() : {};
        const { baseUrl } = body;

        if (!baseUrl) {
            return new Response(JSON.stringify({ error: "Missing baseUrl" }), {
                status: 400,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
            });
        }

        const formattedUrl = formatUrl(baseUrl);

        try {
            const existing = await payload.find({
                collection: "page-duplicates",
                where: { baseUrl: { equals: formattedUrl } },
                limit: 1,
            });

            if (existing.docs.length) {
                const cached = existing.docs[0].duplicates;
                const { sample, summary } = stratifiedSample(cached, 100);
                const histogram = buildHistogram(cached);

                return new Response(
                    JSON.stringify({
                        fromCache: true,
                        data: sample,
                        summary,
                        histogram,
                    }),
                    { 
                        status: 200, 
                        headers: { 
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "POST, OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type"
                        } 
                    }
                );
            }

            return new Response(
                JSON.stringify({ data: [], summary: null, histogram: [] }),
                { 
                    status: 200, 
                    headers: { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    } 
                }
            );
        } catch (error: unknown) {
            console.error('Error in getPageDuplication endpoint:', error);
            const errorMessage = error instanceof Error ? error.message : "Internal server error";
            return new Response(
                JSON.stringify({ error: errorMessage }),
                { 
                    status: 500, 
                    headers: { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    } 
                }
            );
        }
    }),
}; 