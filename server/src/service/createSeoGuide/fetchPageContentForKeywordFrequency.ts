import * as cheerio from 'cheerio';
import { processText } from './processText'; // Ensure this returns string[] and is optimized

/**
 * Count keyword frequencies from the main <p> text content of a web page.
 * @param url - The target page URL
 * @param keywords - List of keywords to count
 * @returns Object mapping keywords to their frequency
 */
export const fetchPageContentForKeywordFrequency = async (
    url: string,
    keywords: string[]
): Promise<Record<string, number>> => {
    try {

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'gzip, deflate, br', // Enable compression
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: controller.signal,
        });

        clearTimeout(timeout);


        if (!response.ok || !response.body){
            console.log(`false : ${url}`);
            return {};
        }

        // Use a stream reader for faster processing instead of waiting for full text
        const reader = response.body?.getReader();
        let html = '';

        if (reader) {
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    html += decoder.decode(value, { stream: true });
                }
            }
        } else {
            html = await response.text(); // Fallback
        }

        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Use `.map()` instead of `.each()` for better performance
        const textContent = $('p')
            .map((_, element) => $(element).text())
            .get()
            .join(' ');

        const tokens = processText(textContent); // should return string[]
        const frequencyMap = new Map<string, number>();

        // Fast token frequency mapping using a Set for lookup
        const keywordSet = new Set(keywords);

        for (const token of tokens) {
            if (keywordSet.has(token)) {
                frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
            }
        }

        // Convert Map to object
        const result: Record<string, number> = {};
        for (const keyword of keywords) {
            result[keyword] = frequencyMap.get(keyword) || 0;
        }

        return result;
    } catch (_error) {
        console.log(`false : ${url}`);
        return {};
    }
};
