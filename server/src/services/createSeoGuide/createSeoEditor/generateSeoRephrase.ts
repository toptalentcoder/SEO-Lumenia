import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "@/config/apiConfig";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
        model: "gpt-4-turbo",
        messages: [
            { role: "user", content: prompt },
            { role: "system", content: "You are an expert SEO content rewriter." }
        ],
        temperature: 0.3,
    });

    return response.choices?.[0]?.message?.content ?? "";
}
