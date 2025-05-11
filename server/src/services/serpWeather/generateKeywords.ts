import { seedKeywordsMap } from '@/globals/seedKeywordsMap';
import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '@/config/apiConfig';

const openai = new OpenAI({ apiKey : OPENAI_API_KEY });

export async function generateKeywordsForSERPWeatherCategory(category : string) : Promise<string[]> {

    const seeds = seedKeywordsMap[category] || [];

    const seedText = seeds.length
        ? `\n\nHere are example seed keywords to guide your generation:\n- ${seeds.join("\n- ")}\n`
        : "";

    const prompt = `
        Generate a list of 10 high-quality, SEO-relevant keywords for the "${category}" category.
        Each keyword must:
            - Be a popular search query that a user might enter into Google.
            - Be suitable for rank tracking or SERP volatility monitoring
            - Focued on informational, commercial, or navigational intent.
            - Avoid placeholder text. Output only the keyword phrases, comma-separated.
            Return the output as a comma-separated flat list with no numbering.
        ${seedText}
    `

    const response = await openai.chat.completions.create({
        model : 'gpt-4',
        messages : [{ role : 'user', content : prompt }],
        temperature : 0.7,
    });

    const text = response.choices[0].message?.content ?? "";
    return text.split(",").map(k => k.trim()).filter(k => k.length > 0).slice(0, 10);

}