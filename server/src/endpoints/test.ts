import { withErrorHandling } from "@/middleware/errorMiddleware";
import { checkUrlPresenceAcrossKeywords } from "@/services/createSeoGuide/checkUrlPresenceAcrossKeywords";
import { generateSEOKeywords } from "@/services/createSeoGuide/generateSEOKeywords";
import { Endpoint } from "payload";

export const testEndpoint: Endpoint = {
    path: '/test',
    method: 'post',
    handler: withErrorHandling(async (req): Promise<Response> => {

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const TARGET_URLS = [
            "https://www.cnet.com/tech/services-and-software/best-vpn/",
            "https://www.pcmag.com/picks/the-best-vpn-services",
            "https://www.reddit.com/r/PrivateInternetAccess/comments/1imedjl/best_vpn_service_according_to_reddit/",
            "https://www.security.org/vpn/best/"
        ];

        const body = await req.json();
        const { query, location, language } = body;

        console.log(`Generating keywords for: "${query}" in ${location} market...`);

        // Generate the SEO keywords
        const keywordsResponse = await generateSEOKeywords(query, location, language);

        if (!keywordsResponse) {
            return new Response(
                JSON.stringify({ error: "Failed to generate keywords" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log(`Generated ${keywordsResponse.length} keywords. Checking SERP rankings...`);

        const results = await checkUrlPresenceAcrossKeywords(keywordsResponse, TARGET_URLS, location);

        console.log("\n📊 URL Top 20 Presence Summary:");
        for (const [url, count] of Object.entries(results)) {
            console.log(`- ${url}: ${count} / ${keywordsResponse.length} keywords`);
        }

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    })
};
