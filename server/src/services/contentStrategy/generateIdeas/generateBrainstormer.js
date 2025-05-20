import OpenAI from 'openai';
import { OPENAI_API_KEY} from '../../../config/apiConfig';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Generates structured brainstorm ideas using OpenAI function calling.
 * @param {string} query - The topic or keyword to brainstorm around.
 * @param {string} lang - Language code (e.g., "en_us", "fr_fr").
 */
export async function generateBrainstormerIdeas(query, lang) {
    const functions = [
        {
            name: 'generate_brainstormer_ideas',
            description: 'Generate 10 structured article ideas for a given keyword',
            parameters: {
                type: 'object',
                properties: {
                    lang: { type: 'string', description: 'Language code like en_us or fr_fr' },
                    query: { type: 'string', description: 'The search query or content topic' },
                    type: {
                        type: 'string',
                        enum: ['GPT_DIGITAL_BRAINSTORMER'],
                        description: 'Type of brainstorm content',
                    },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                description: { type: 'string' },
                                keywords: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    minItems: 3,
                                    maxItems: 5,
                                },
                                persona: { type: 'string' },
                                outline: { type: 'string' },
                                level: {
                                    type: 'string',
                                    enum: ['basique', 'avancé', 'expert'],
                                },
                            },
                            required: ['title', 'description', 'keywords', 'persona', 'outline', 'level'],
                        },
                        minItems: 10,
                        maxItems: 10,
                    },
                },
                required: ['lang', 'query', 'type', 'data'],
            },
        },
    ];

    const prompt = `
        You are a multilingual SEO ideation assistant trained to emulate the Digital Brainstormer tool from YourText.Guru.

        Given the query: "${query}" and language code: "${lang}", generate exactly 10 high-quality article ideas with a modern SEO style.

        Use the following format for each idea:
        - title: Engaging, specific, and SEO-optimized. Use phrases like “Top X for Y”, “Best X in {2025}”, “How to…”, “The Ultimate Guide to…”, etc. Include the current year when relevant.
        - description: 1 sentence, persuasive, click-worthy, and direct. Mention benefit or goal.
        - keywords: A mix of short and long-tail SEO keywords. Always 4–5 per entry.
        - persona: Highly specific target group. Example: “Privacy-conscious internet users facing government restrictions”.
        - outline: A numbered, concise, 5-part structure. Style: 1. ..., 2. ..., 3. ..., 4. ..., 5. ...
        - level: Pick based on complexity. Choose from: basique, avancé, expert.

        Language of all text must match: "${lang}"

        Avoid vague phrases or overly academic language. The tone must match these real examples:

        Example 1
        - title: The Ultimate Guide to Choosing the Best VPN in 2025
        - description: Discover the top VPNs of 2025 and learn how to choose the best one for your needs.
        - keywords: ["VPN", "online privacy", "security", "internet freedom", "best vpn 2023"]
        - persona: Tech-savvy individuals looking to enhance their online security and privacy.
        - outline: 1. Introduction to VPNs, 2. Benefits of using a VPN, 3. Top VPNs of 2023, 4. How to choose the best VPN, 5. Conclusion and recommendations
        - level: expert

        Example 2
        - title: Comparison: Free vs Paid VPNs in 2025
        - description: Explore the differences between free and paid VPNs. Find the best value for your privacy needs.
        - keywords: ["free VPN", "paid VPN", "cost-benefit", "VPN features", "best value"]
        - persona: Budget-conscious individuals weighing the benefits of free versus paid VPN services.
        - outline: 1. Introduction to VPN types, 2. Pros and cons of free VPNs, 3. Features of paid VPNs, 4. Cost analysis, 5. Recommendations
        - level: basique

        Output as valid JSON using the provided function schema only.
    `;

    const messages = [
        {
            role: 'system',
            content:
                'You are a multilingual SEO brainstorm assistant. You return only JSON that exactly matches the function schema. No explanations or comments.',
        },
        {
            role: 'user',
            content: prompt,
        },
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages,
        functions,
        function_call: { name: 'generate_brainstormer_ideas' },
        temperature: 0.8,
    });

    const toolCall = response.choices[0]?.message?.function_call;
    const result = JSON.parse(toolCall.arguments);
    return result;
}