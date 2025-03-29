import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function rephraseText(content: string): Promise<string> {
    const prompt = `
        You are an expert content rewriter.
        Take the following content and rephrase it to be more semantically complete and natural-sounding, while maintaining the original meaning and structure.

        Content:

        ${content}

        Return only the rephrased version.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content ?? "";
}
