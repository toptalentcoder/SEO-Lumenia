import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function rephraseText(content: string, language: string = "English"): Promise<string> {
    const prompt = `
        You are an expert content rewriter.
        Take the following content and rephrase it to be more semantically complete and natural-sounding, while maintaining the original meaning and structure.
        The content should be written in ${language} language.

        Content:

        ${content}

        Return only the rephrased version, ensuring it is in ${language} language.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content ?? "";
}
