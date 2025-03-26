import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Verify content based on SEO brief
interface SeoBrief {
    objective: string[];
    mainTopics: string[];
    importantQuestions: string[];
    writingStyleAndTone: string[];
    recommendedStyle: string[];
    valueProposition: string[];
}

export async function verifyContentWithSeoBrief(content: string, seoBrief: SeoBrief) {
    const prompt = `
        You are an expert in SEO content. I will provide you with an SEO brief and content. Please verify if the content aligns with the brief.
        If something is missing or needs improvement, suggest changes or additions.

        SEO Brief:
        - Objective: ${seoBrief.objective.join(", ")}
        - Key Topics: ${seoBrief.mainTopics.join(", ")}
        - Important Questions: ${seoBrief.importantQuestions.join(", ")}
        - Writing Style and Tone: ${seoBrief.writingStyleAndTone.join(", ")}
        - Recommended Style: ${seoBrief.recommendedStyle.join(", ")}
        - Value Proposition: ${seoBrief.valueProposition.join(", ")}

        Content:
        ${content}

        Please verify if the content covers the brief. List areas that need improvement or anything missing.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
}