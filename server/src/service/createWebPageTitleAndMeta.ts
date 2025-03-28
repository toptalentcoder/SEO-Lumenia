import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSeoOutline({
    query,
    keywords,
}: {
    query: string;
    keywords: string[];
}): Promise<string[]> {
    const prompt = `
        Generate a title tag and a meta description for the query: "${query}" based on the following keywords:
        ${keywords.join(", ")}.

        The title should be catchy, concise (under 60 characters), and directly related to the user's query. It should include the most relevant keywords and make it appealing for search engines. 
        The meta description should summarize the content, highlight the key benefits of the topic, and encourage users to click. It should also include some of the relevant keywords and be under 160 characters.

        Provide three variations of title tags and meta descriptions.

        Example output format:
        Title Tag 1: "Top VPN Choices: Best for Speed and Security"
        Meta Description 1: "Discover the best VPNs for speed, security, and privacy. Enhance your online experience today! Click to find the perfect fit for you!"
        Title Tag 2: "Best VPN Services: Top Picks for 2023"
        Meta Description 2: "Explore the best VPN services for 2023. Protect your privacy and stream securely. Choose your ideal VPN today!"
        Title Tag 3: "VPN Guide: Choosing the Best VPN for You"
        Meta Description 3: "Find out how to select the best VPN. Ensure top security and privacy online. Act now to safeguard your data!"
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    return text?.split(/\n\d+\.\s+/).filter(q => q.trim() !== "") ?? [];
}
