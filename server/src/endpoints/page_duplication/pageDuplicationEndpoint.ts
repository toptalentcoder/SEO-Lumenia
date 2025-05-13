import { pageDuplicationAnalysis } from '@/services/UrlPageServie/pageDuplicationAnalysis';
import { Endpoint, PayloadRequest } from 'payload';
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { FRONTEND_URL } from "@/config/apiConfig";

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
                    "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
            });
        }

        const formattedUrl = formatUrl(baseUrl);
        console.log('[INFO] Starting page duplication analysis for:', formattedUrl);

        // Set a timeout for the entire operation
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => reject(new Error("Operation timed out after 5 minutes")), 300000); // 5 minutes timeout
        });

        try {
            // Create a promise for the actual operation
            const operationPromise = (async (): Promise<Response> => {
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
            })();

            // Race between the operation and the timeout
            return await Promise.race([operationPromise, timeoutPromise]);
        } catch (error: unknown) {
            console.error('[ERROR] Error in page duplication endpoint:', error);
            const errorMessage = error instanceof Error ? error.message : "Internal server error";
            return new Response(
                JSON.stringify({ 
                    error: errorMessage,
                    details: error instanceof Error ? error.stack : undefined
                }),
                { 
                    status: 500, 
                    headers: { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    } 
                }
            );
        }
    }),
};
