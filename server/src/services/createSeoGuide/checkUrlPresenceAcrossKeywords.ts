import pLimit from "p-limit";
import { fetchSerpResults } from "./fetchSerpResults";

export async function checkUrlPresenceAcrossKeywords(keywords: string[], targetUrls: string[], location: string, concurrency = 50) {
    const urlMatchCount: Record<string, number> = {};
    for (const url of targetUrls) {
        urlMatchCount[url] = 0;
    }
  
    const limit = pLimit(concurrency);
  
    const tasks = keywords.map((keyword) =>
        limit(async () => {
            try {
                const results = await fetchSerpResults(keyword, location);
                for (const url of targetUrls) {
                    if (results.some((r: any) => r.link.includes(url))) {
                        urlMatchCount[url]++;
                    }
                }
            } catch (err) {
                console.error(`Error fetching SERP for: "${keyword}"`, (err as Error).message);
            }
        })
    );
  
    await Promise.all(tasks);
    return urlMatchCount;
}