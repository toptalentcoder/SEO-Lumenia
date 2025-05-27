import { pageDuplicationAnalysis } from '@/services/UrlPageServie/pageDuplicationAnalysis';
import { Endpoint, PayloadRequest } from 'payload';
import { withErrorHandling } from "@/middleware/errorMiddleware";
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

export const pageDuplicationEndpoint: Endpoint = {
    path: '/page-duplication',
    method: 'post',
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
<<<<<<< HEAD

        // Set a timeout for the entire operation
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => reject(new Error("Operation timed out")), 300000); // 5 minutes timeout
=======
        console.log('[INFO] Starting page duplication analysis for:', formattedUrl);

        // Set a timeout for the entire operation
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => reject(new Error("Operation timed out after 5 minutes")), 300000); // 5 minutes timeout
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
        });

        try {
            // Create a promise for the actual operation
            const operationPromise = (async (): Promise<Response> => {
<<<<<<< HEAD
                const result = await pageDuplicationAnalysis(formattedUrl, payload);

                return new Response(
                    JSON.stringify(result),
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
=======
                try {
                    console.log('[INFO] Fetching internal URLs for:', formattedUrl);
                    const result = await pageDuplicationAnalysis(formattedUrl, payload);
                    console.log('[INFO] Page duplication analysis completed successfully');

                    return new Response(
                        JSON.stringify(result),
                        { 
                            status: 200, 
                            headers: { 
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                                "Access-Control-Allow-Methods": "POST, OPTIONS",
                                "Access-Control-Allow-Headers": "Content-Type"
                            } 
                        }
                    );
                } catch (error) {
                    console.error('[ERROR] Error in page duplication analysis:', error);
                    throw error; // Re-throw to be caught by outer try-catch
                }
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
            })();

            // Race between the operation and the timeout
            return await Promise.race([operationPromise, timeoutPromise]);
        } catch (error: unknown) {
<<<<<<< HEAD
            console.error('Error in page duplication endpoint:', error);
            const errorMessage = error instanceof Error ? error.message : "Internal server error";
            return new Response(
                JSON.stringify({ error: errorMessage }),
=======
            console.error('[ERROR] Error in page duplication endpoint:', error);
            const errorMessage = error instanceof Error ? error.message : "Internal server error";
            return new Response(
                JSON.stringify({ 
                    error: errorMessage,
                    details: error instanceof Error ? error.stack : undefined
                }),
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
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
