import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '@/config/apiConfig';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateSeoOutline({
    query,
    keywords,
    language = "English"
}: {
    query: string;
    keywords: string[];
    language?: string;
}): Promise<string[]> {
    const prompt = `
        You are an SEO strategist.

        Generate a detailed, hierarchical outline for an SEO article based on the query: "${query}".
        The outline should be in ${language} language.

        Use the following keywords where appropriate: ${keywords.join(', ')}

        Format the outline as:
        1. Title
        1.1 Section Title
        1.1.1 Subsection Title
        ...

        Include common SEO content blocks like:
        - Introduction (definitions, importance)
        - Technical explanations (how it works, features)
        - Comparisons between products/services
        - Buyer considerations (what to look for)
        - Recommendations and examples

        Make the outline comprehensive but not too long (max 5 main sections).
        All content should be in ${language} language.
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
    });

    const text = response.choices[0].message.content;
  // Split on each line and keep only numbered ones
  return text
    ?.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^\d+(\.\d+)*\s/.test(line)) ?? [];
}
