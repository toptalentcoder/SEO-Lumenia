import { withErrorHandling } from "@/middleware/errorMiddleware";
import axios from "axios";
import { Endpoint, PayloadRequest } from "payload";
import { SEMRUSH_API_KEY } from "@/config/apiConfig";

export const searchBacklinksEndpoint : Endpoint = {
    path: "/search-backlinks",
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

        // Validate baseUrl format
        try {
            new URL(baseUrl);
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid baseUrl format" }), {
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
            // Fetch fresh data from Semrush API
            const response = await axios.get('https://api.semrush.com/analytics/v1/', {
                params: {
                    type: 'backlinks',
                    target: baseUrl,
                    key: SEMRUSH_API_KEY,
                    target_type: 'domain',
                    database: 'us',
                    export_columns: 'source_url,target_url,anchor,nofollow,page_ascore',
                    display_limit: 100,
                },
            });

            if (!response.data || typeof response.data !== 'string') {
                return new Response(JSON.stringify({ error: "Invalid response from Semrush API" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const lines = response.data.split('\n');
            if (lines.length < 2) {
                return new Response(JSON.stringify({ error: "No backlinks found for this domain" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const backlinks = lines
                .slice(1)
                .map((line: string) => {
                    const [sourceUrl, targetUrl, anchor, nofollow, pageAscore] = line.split(';');

                    // Ensure all fields are properly formatted and validated
                    const cleanSourceUrl = sourceUrl?.trim() || '';
                    const cleanTargetUrl = targetUrl?.trim() || '';
                    const cleanAnchor = anchor?.replace(/^"+|"+$/g, "").trim() || "No anchor text";
                    const authorityScore = pageAscore?.replace("\r", "").trim() || "0";
                    const followType = nofollow === "true" ? "nofollow" : "dofollow" as const;

                    // Validate authorityScore is a valid number
                    const parsedAuthorityScore = parseFloat(authorityScore);
                    if (isNaN(parsedAuthorityScore)) {
                        return null;
                    }

                    const anchorBoost = cleanAnchor && cleanAnchor.length > 2 ? 1.2 : 0.8;
                    const linkStrength = Math.round(parsedAuthorityScore * (followType === "dofollow" ? 1 : 0.5) * anchorBoost);

                    // Only include backlinks that have valid required fields
                    if (!cleanSourceUrl || !cleanTargetUrl || !cleanAnchor) {
                        return null;
                    }

                    return {
                        sourceUrl: cleanSourceUrl,
                        targetUrl: cleanTargetUrl,
                        anchorText: cleanAnchor,
                        followType,
                        authorityScore,
                        linkStrength: Number(linkStrength)
                    };
                })
                .filter((backlink): backlink is {
                    sourceUrl: string;
                    targetUrl: string;
                    anchorText: string;
                    followType: 'dofollow' | 'nofollow';
                    authorityScore: string;
                    linkStrength: number;
                } => backlink !== null);

            // Save the backlinks data to the user's history
            const existingSite = await req.payload.find({
                collection: 'backlink-sites',
                where: {
                    baseUrl: {
                        equals: baseUrl,
                    },
                },
            });

            if (existingSite.docs.length > 0) {
                // Update existing site with new search history
                const siteId = existingSite.docs[0].id;
                const currentHistory = (existingSite.docs[0] as any).searchHistory as Array<{
                    userEmail: string;
                    searchedAt: string;
                    backlinks: Array<{
                        sourceUrl: string;
                        targetUrl: string;
                        anchorText: string;
                        followType: 'dofollow' | 'nofollow';
                        authorityScore: string;
                        linkStrength: number;
                    }>;
                }> || [];

                // Remove any existing history for this user
                const filteredHistory = currentHistory.filter(
                    (history) => history.userEmail !== email
                );

                // Add new history entry
                filteredHistory.push({
                    userEmail: email,
                    searchedAt: new Date().toISOString(),
                    backlinks: backlinks,
                });

                await req.payload.update({
                    collection: 'backlink-sites',
                    id: siteId,
                    data: {
                        searchHistory: filteredHistory
                    },
                });
            } else {
                // Create new site with search history
                try {
                    await req.payload.create({
                        collection: 'backlink-sites',
                        data: {
                            baseUrl: baseUrl,
                            searchHistory: [
                                {
                                    userEmail: email,
                                    searchedAt: new Date().toISOString(),
                                    backlinks: backlinks
                                }
                            ]
                        }
                    });
                } catch (error) {
                    console.error("Error creating backlink site:", error);
                    return new Response(JSON.stringify({ 
                        error: "Failed to create backlink site",
                        details: error instanceof Error ? error.message : "Unknown error"
                    }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }

            return new Response(JSON.stringify(backlinks), {
                status: 200,
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