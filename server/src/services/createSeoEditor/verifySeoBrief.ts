import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
You are an SEO content analyst. Given the SEO brief and article content, verify if each item in the brief is fulfilled in the content.

Return a JSON with this structure:
{
  "objective": boolean,
  "mainTopics": string[],
  "importantQuestions": string[],
  "writingStyleAndTone": string[],
  "recommendedStyle": string[],
  "valueProposition": string[],
  "improvementText": string
}

SEO Brief:
- Objective: ${seoBrief.objective.join(", ")}
- Main Topics: ${seoBrief.mainTopics.join(", ")}
- Important Questions: ${seoBrief.importantQuestions.join(", ")}
- Writing Style and Tone: ${seoBrief.writingStyleAndTone.join(", ")}
- Recommended Style: ${seoBrief.recommendedStyle.join(", ")}
- Value Proposition: ${seoBrief.valueProposition.join(", ")}

Content:
${content}

Now return ONLY the JSON result.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  try {
    if (!response.choices[0].message.content) {
      throw new Error("OpenAI response content is null or undefined");
    }
    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed;
  } catch (error) {
    console.error("❌ Failed to parse OpenAI response:", error);
    throw new Error("Failed to parse verification result");
  }
}
