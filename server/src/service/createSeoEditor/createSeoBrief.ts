import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSeoBrief(query: string) {
    const prompt = `
        Generate a comprehensive SEO brief for the query: ${query}

        The SEO brief should have the following structure:

        1. **Primary Intent**:
            - Answer with a single word (e.g., "Informational") that defines the purpose of the content.

        2. **Objective**:
            - Provide 3-4 sentences describing the overall objective of the content and its role in helping the reader.

        3. **Main Topics to Cover**:
            - List 4-5 key subjects or areas to cover in the content.
            - Also include 4-5 important questions related to the query that should be addressed in the content.

        4. **Writing Style and Tone**:
            - Recommend 2 styles from the following list: "Friendly", "Professional", "Cheerful", "Informative", "Inspirational", "Casual", "Urgent", "Motivational", "Humorous", "Empathetic", "Concise", "Sharp", "Smart". Choose based on the topic and desired engagement.

        5. **Recommended Style**:
            - Provide 4-5 sentences describing the recommended writing style: clear, concise, engaging, with bullet points where applicable.

        6. **Value Proposition**:
            - Answer with 3-5 sentences explaining why the content matters and how it benefits the reader.

        Return the result as a structured SEO brief.
    `;

    // OpenAI GPT-3 API call to generate the SEO brief
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    // Parsing and returning the response from OpenAI API
    const seoBrief = response.choices?.[0]?.message?.content ?? "Error generating SEO brief";
    return seoBrief;
}