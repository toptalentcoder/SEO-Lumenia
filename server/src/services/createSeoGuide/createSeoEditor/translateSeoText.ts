import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/config/apiConfig";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    const prompt = `Translate the following SEO blog content to ${targetLanguage}. Keep formatting and bullet points where possible:\n\n${text}`;

    const chat = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    return chat.choices[0]?.message.content || "";
}
