import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "@/config/apiConfig";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function autoExpandSeoText(rawContent: string, language: string = "English"): Promise<string> {
    const prompt = `
        Take the following content and enhance it to be more semantically complete, natural-sounding, and optimized for SEO. Expand the points with helpful, specific, and engaging phrasing. Don't remove the structure — just enrich each part with meaningful detail.
        The content should be written in ${language} language.

        Here is the content:

        ${rawContent}

        Return the rewritten version only, ensuring it is in ${language} language.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            { role: "user", content: prompt },
            { role: "system", content: "You are an expert SEO content writer." }
        ],
        temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content ?? "";
}
