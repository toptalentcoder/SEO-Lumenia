import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '@/config/apiConfig';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateSeoQuestions({
    query,
    keywords,
    language = "English"
}: {
    query: string;
    keywords: string[];
    language?: string;
}): Promise<string[]> {
    const prompt = `
        You are an expert SEO content strategist.

        Based on the topic: "${query}" and the following keywords:
        ${keywords.join(', ')}

        Generate 20 SEO-optimized FAQ-style questions in ${language}. The questions should:
        - Be helpful and conversational
        - Use relevant industry terms and product names from the keywords
        - Include a mix of search intent: comparison, how-to, technical explanation, problems, reviews
        - Cover SEO-rich angles: "kill switch", "split tunneling", "money-back guarantee", "free vs premium", "speed test", etc.
        - Be suitable for use in featured snippets or People Also Ask sections
        - Be written in ${language} language

        Format:
        1. [question 1]
        2. [question 2]
        ...
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    return text?.split(/\n\d+\.\s+/).filter(q => q.trim() !== "") ?? [];
}
