import { seedKeywordsMap } from '@/globals/seedKeywordsMap';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey : process.env.OPENAI_API_KEY });

export async function generateKeywordsForSERPWeatherCategory(category : string) : Promise<string[]> {

    const seeds = seedKeywordsMap[category] || [];

    const seedText = seeds.length
        ? `\n\nHere are example seed keywords to guide your generation:\n- ${seeds.join("\n- ")}\n`
        : "";

    const prompt = `
        Generate a list of 500 real, SEO-relevant keywords for the "${category}" category.
        Each keyword must:
        - Reflect natural, human-like Google search queries
        - Be diverse across subtopics within the category
        - Be suitable for rank tracking or SERP volatility monitoring
        - Be commercial or informational in nature
        - Avoid duplicates, placeholders, or generic patterns
        Return the output as a comma-separated flat list with no numbering.
        ${seedText}
    `;

    const response = await openai.chat.completions.create({
        model : 'gpt-4',
        messages : [{ role : 'user', content : prompt }],
        temperature : 0.7,
    });

    const text = response.choices[0].message?.content ?? "";
    return text.split(",").map(k => k.trim()).filter(k => k.length > 0);

}