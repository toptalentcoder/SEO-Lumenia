import { AzureOpenAI } from "openai";
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT } from "@/config/apiConfig";


const options = {
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_API_KEY,
    deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
    apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
};

const openai = new AzureOpenAI(options);

/**
 * Generates structured brainstorm ideas using OpenAI function calling.
 * @param {string} query - The topic or keyword to brainstorm around.
 * @param {string} lang - Language code (e.g., "en_us", "fr_fr").
 */
export async function generateBrainstormerIdeas(query : string, lang : string) {

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

    const response = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'You are a multilingual SEO brainstorm assistant. You return only JSON that exactly matches the function schema. No explanations or comments.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response content");

    const result = JSON.parse(content);
    return result;
}