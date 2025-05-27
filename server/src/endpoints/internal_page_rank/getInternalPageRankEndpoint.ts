import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { PayloadRequest } from "payload";
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

export const getInternalPageRankEndpoint: Endpoint = {
    path: "/get-internal-pagerank",
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

        try {
            const existing = await payload.find({
                collection: "internalPageRanks",
                where: { baseUrl: { equals: formattedUrl } },
                limit: 1,
            });

            if (existing.docs.length) {
                return new Response(
                    JSON.stringify({ data: existing.docs[0].scores }),
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

            return new Response(
                JSON.stringify({ data: [] }),
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
        } catch (error: unknown) {
            console.error('Error in getInternalPageRank endpoint:', error);
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