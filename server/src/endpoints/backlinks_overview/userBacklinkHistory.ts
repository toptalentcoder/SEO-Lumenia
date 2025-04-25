import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const userBacklinkHistoryEndpoint: Endpoint = {
    path: "/user-backlink-history",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const body = req.json ? await req.json() : {};
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: "Missing email" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            // Get all backlink sites
            const allSites = await req.payload.find({
                collection: 'backlink-sites',
            });

            // Filter sites that have history for the current user
            const userHistory = allSites.docs
                .filter(site => {
                    return site.searchHistory?.some(
                        (history: any) => history.userEmail === email
                    );
                })
                .map(site => {
                    // Find the user's history entry
                    const userHistoryEntry = site.searchHistory?.find(
                        (history: any) => history.userEmail === email
                    );
                    return {
                        domain: site.domain, // Using domain property from BacklinkSite
                        searchedAt: userHistoryEntry?.searchedAt, // Added optional chaining
                        backlinkCount: userHistoryEntry?.backlinks?.length || 0, // Added optional chaining
                    };
                })
                .sort((a, b) => {
                    // Handle undefined dates by placing them at the end
                    if (!a.searchedAt) return 1;
                    if (!b.searchedAt) return -1;
                    return new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime();
                }); // Sort by most recent first

            return new Response(JSON.stringify(userHistory), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching user backlink history:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch user backlink history" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    })
} 