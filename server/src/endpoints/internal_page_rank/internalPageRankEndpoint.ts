import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";
import { internalPageRank } from "@/services/UrlPageServie/internalPageRank";
<<<<<<< HEAD
=======
import { FRONTEND_URL } from "@/config/apiConfig";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

function formatUrl(url: string): string {
    if (!url) return '';
    // Remove any existing protocol
    const cleanUrl = url.replace(/^https?:\/\//, '');
    // Add https:// prefix
    return `https://${cleanUrl}`;
}

export const internalPageRankEndpoint: Endpoint = {
    path: "/internal_pagerank",
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
<<<<<<< HEAD
                    "Access-Control-Allow-Origin": "*",
=======
                    "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
            });
        }

        const formattedUrl = formatUrl(baseUrl);

        // Set a timeout for the entire operation
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => reject(new Error("Operation timed out")), 300000); // 5 minutes timeout
        });

        try {
            // Create a promise for the actual operation
            const operationPromise = (async (): Promise<Response> => {
                const existing = await payload.find({
                    collection: "internalPageRanks",
                    where: { baseUrl: { equals: formattedUrl } },
                    limit: 1,
                });

                if (existing.docs.length) {
                    return new Response(
                        JSON.stringify({ fromCache: true, data: existing.docs[0].scores }),
                        { 
                            status: 200, 
                            headers: { 
                                "Content-Type": "application/json",
<<<<<<< HEAD
                                "Access-Control-Allow-Origin": "*",
=======
                                "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                                "Access-Control-Allow-Methods": "POST, OPTIONS",
                                "Access-Control-Allow-Headers": "Content-Type"
                            } 
                        }
                    );
                }

                const scores = await internalPageRank(formattedUrl, payload);

                await payload.create({
                    collection: "internalPageRanks",
                    data: {
                        baseUrl: formattedUrl,
                        scores: scores.map(score => ({
                            url: score.url,
                            score: score.score
                        })),
                        lastCrawledAt: new Date().toISOString(),
                    },
                });

                return new Response(
                    JSON.stringify({ fromCache: false, data: scores }),
                    { 
                        status: 200, 
                        headers: { 
                            "Content-Type": "application/json",
<<<<<<< HEAD
                            "Access-Control-Allow-Origin": "*",
=======
                            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                            "Access-Control-Allow-Methods": "POST, OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type"
                        } 
                    }
                );
            })();

            // Race between the operation and the timeout
            return await Promise.race([operationPromise, timeoutPromise]);
        } catch (error: unknown) {
            console.error('Error in internalPageRank endpoint:', error);
            const errorMessage = error instanceof Error ? error.message : "Internal server error";
            return new Response(
                JSON.stringify({ error: errorMessage }),
                { 
                    status: 500, 
                    headers: { 
                        "Content-Type": "application/json",
<<<<<<< HEAD
                        "Access-Control-Allow-Origin": "*",
=======
                        "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    } 
                }
            );
        }
    }),
};
