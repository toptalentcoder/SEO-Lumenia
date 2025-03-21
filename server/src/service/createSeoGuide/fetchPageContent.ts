import * as cheerio from 'cheerio';

export const fetchPageContent = async (url: string): Promise<string | null> => {
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
            return null;
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

        return textContent.trim();
    } catch (_error) {
        console.log(`false : ${url}`);
        return null;
    }
};
