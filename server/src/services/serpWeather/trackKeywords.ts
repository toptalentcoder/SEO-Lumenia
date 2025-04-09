// ✅ 2. Daily Tracker: Save Top 10 Results
import axios from "axios";
import { Payload } from "payload";

interface OrganicResult {
    title: string;
    link: string;
}

const SERP_API_KEY = process.env.SERP_API_KEY;
const today = new Date().toISOString().split("T")[0];

export const trackKeywordTop10 = async (payload: Payload) => {
    const keywords = await payload.find({
        collection: "serpWeatherKeywords",
        limit: 1000,
    });

    for (const doc of keywords.docs) {
        const { keyword, category } = doc;

        try {
            const response = await axios.get("https://serpapi.com/search", {
                params: {
                    q: keyword,
                    api_key: SERP_API_KEY,
                    hl: "en",
                    gl: "us",
                },
            });

            const top10 = (response.data.organic_results || []).slice(0, 10);

            const results = top10.map((item: OrganicResult, index: number) => ({
                rank: index + 1,
                title: item.title,
                link: item.link,
            }));

            await payload.create({
                collection: "serpSnapshots",
                data: {
                    keyword,
                    category,
                    date: today,
                    results,
                    source: "serpapi",
                },
            });

            console.log(`✅ Saved snapshot for ${keyword}`);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`❌ Failed for ${keyword}:`, err.message);
            } else {
                console.error(`❌ Failed for ${keyword}:`, err);
            }
        }
    }
};