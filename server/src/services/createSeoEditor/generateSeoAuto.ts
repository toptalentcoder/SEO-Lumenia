import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function autoExpandSeoText(rawContent: string): Promise<string> {
    const prompt = `
        You are an SEO expert and writer.

        Take the following content and enhance it to be more semantically complete, natural-sounding, and optimized for SEO. Expand the points with helpful, specific, and engaging phrasing. Don't remove the structure — just enrich each part with meaningful detail.

        Here is the content:

        ${rawContent}

        Return the rewritten version only.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content ?? "";
}
