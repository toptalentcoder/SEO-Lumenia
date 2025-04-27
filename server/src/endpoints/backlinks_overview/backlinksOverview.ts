import { withErrorHandling } from "@/middleware/errorMiddleware";
import axios from "axios";
import { Endpoint, PayloadRequest } from "payload";

export const backlinksOverviewEndpoint : Endpoint = {
    path: "/backlinks-overview",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const body = req.json ? await req.json() : {};
        const { baseUrl, email } = body;

        if (!baseUrl) {
            return new Response(JSON.stringify({ error: "Missing baseUrl" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!email) {
            return new Response(JSON.stringify({ error: "Missing email" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            // Check if we have data for this baseUrl in the user's history
            const existingSite = await req.payload.find({
                collection: 'backlink-sites',
                where: {
                    baseUrl: {
                        equals: baseUrl,
                    },
                },
            });

            if (existingSite.docs.length > 0) {
                const site = existingSite.docs[0];
                const userHistory = site.searchHistory?.find(
                    (history: any) => history.userEmail === email
                );

                if (userHistory) {
                    return new Response(JSON.stringify(userHistory.backlinks), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }

            // If no history found for this user, return error
            return new Response(JSON.stringify({ 
                error: "No search history found for this baseUrl. Please use the search function first." 
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });

        } catch (error) {
            console.error("Error fetching backlinks:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch backlinks" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    })
}