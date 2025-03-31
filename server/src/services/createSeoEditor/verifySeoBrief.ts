import { OpenAI } from "openai";
import pLimit from "p-limit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SeoBrief {
  objective: string[];
  mainTopics: string[];
  importantQuestions: string[];
  writingStyleAndTone: string[];
  recommendedStyle: string[];
  valueProposition: string[];
}

async function verifyItemPresence(
  content: string,
  type: string,
  item: string
): Promise<boolean> {
  try {
    const prompt = `
You are an SEO verifier. Your job is to check whether the following ${type} is clearly present in the content below.

Item:
"${item}"

Content:
${content}

Respond with only:
true — if the item is explicitly covered in the content.
false — if it is not.

Return only true or false, nothing else.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const result = response.choices[0].message.content?.trim().toLowerCase();
    return result === "true";
  } catch (error) {
    console.error(`❌ Error verifying \"${item}\" (${type}):`, error);
    return false; // fail-safe fallback
  }
}

export async function verifyContentWithSeoBrief(
  content: string,
  seoBrief: SeoBrief
) {
  const verificationResult: Record<keyof SeoBrief, string[] | boolean> = {
    objective: false,
    mainTopics: [],
    importantQuestions: [],
    writingStyleAndTone: [],
    recommendedStyle: [],
    valueProposition: [],
  };

  // Limit concurrency to avoid OpenAI rate limit
  const limit = pLimit(3);

  // Objective
  const combinedObjective = seoBrief.objective.join(" ");
  verificationResult.objective = await verifyItemPresence(
    content,
    "objective",
    combinedObjective
  );

  // Helper to verify lists
  const checkItems = async (
    key: keyof typeof verificationResult,
    label: string,
    items: string[]
  ) => {
    const results = await Promise.all(
      items.map((item) =>
        limit(async () => {
          const isPresent = await verifyItemPresence(content, label, item);
          return isPresent ? item : null;
        })
      )
    );
    verificationResult[key] = results.filter(Boolean) as string[];
  };

  await checkItems("mainTopics", "main topic", seoBrief.mainTopics);
  await checkItems("importantQuestions", "important question", seoBrief.importantQuestions);
  await checkItems("writingStyleAndTone", "writing style or tone", seoBrief.writingStyleAndTone);
  await checkItems("recommendedStyle", "recommended style", seoBrief.recommendedStyle);
  await checkItems("valueProposition", "value proposition", seoBrief.valueProposition);

  // Get improvement text
  let improvementText = "";
  try {
    const suggestionPrompt = `
You are an SEO assistant. Given the following SEO brief and article content, suggest what could be improved or added.

SEO Brief:
- Objective: ${seoBrief.objective.join(", ")}
- Main Topics: ${seoBrief.mainTopics.join(", ")}
- Important Questions: ${seoBrief.importantQuestions.join(", ")}
- Writing Style and Tone: ${seoBrief.writingStyleAndTone.join(", ")}
- Recommended Style: ${seoBrief.recommendedStyle.join(", ")}
- Value Proposition: ${seoBrief.valueProposition.join(", ")}

Content:
${content}

Suggest missing elements or areas for improvement:
    `;

    const suggestionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: suggestionPrompt }],
      temperature: 0.5,
    });

    improvementText = suggestionResponse.choices[0].message.content?.trim() ?? "";
  } catch (error) {
    console.warn("GPT failed to generate improvement text:", error);
  }

  return {
    ...verificationResult,
    improvementText,
  };
}
