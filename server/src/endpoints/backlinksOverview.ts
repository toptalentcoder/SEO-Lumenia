import { withErrorHandling } from "@/middleware/errorMiddleware";
import axios from "axios";
import { Endpoint, PayloadRequest } from "payload";

export const backlinksOverviewEndpoint : Endpoint = {
    path: "/backlinks-overview",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const body = req.json ? await req.json() : {};
        const { baseUrl } = body;

        if (!baseUrl) {
            return new Response(JSON.stringify({ error: "Missing baseUrl" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try{
            const response = await axios.get('https://api.semrush.com/analytics/v1/', {
                params: {
                    type : 'backlinks',
                    target : baseUrl,
                    key : process.env.SEMRUSH_API_KEY,
                    target_type : 'domain',
                    database : 'us',
                    export_columns: 'source_url,target_url,anchor,nofollow,page_ascore'
                },
            })

            const backlinks = response.data
                .split('\n')
                .slice(1)
                .map((line: string) => {
                    const [sourceUrl, targetUrl, anchor, nofollow, pageAscore] = line.split(';');

                    const anchorText = anchor?.trim();
                    const authorityScore = Number(pageAscore) || 0;
                    const followType = nofollow === "true" ? "nofollow" : "dofollow";
          
                    const anchorBoost = anchorText.length > 2 ? 1.2 : 0.8;
                    const linkStrength = Math.round(authorityScore * (followType === "dofollow" ? 1 : 0.5) * anchorBoost);

                    return {
                        sourceUrl,
                        targetUrl,
                        anchor,
                        followType,
                        pageAscore,
                        linkStrength
                    }
                })
                .filter(Boolean)
                .slice(0, 100);

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