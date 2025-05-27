import { OpenAI, AzureOpenAI } from "openai";
import pLimit from "p-limit";
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from "@/config/apiConfig";

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const options = {
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_API_KEY,
    deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
    apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
};

const openai = new AzureOpenAI(options);

interface SeoBrief {
    objective: string[];
    mainTopics: string[];
    importantQuestions: string[];
    writingStyleAndTone: string[];
    recommendedStyle: string[];
    valueProposition: string[];
}

type VerificationStatus = "fully" | "partially" | "missing";

async function verifyItemPresence(
    content: string,
    type: string,
    item: string
): Promise<VerificationStatus> {
    try {
        const prompt = `
            Your job is to check whether the following ${type} is clearly present in the content below.

            Item:
            "${item}"

            Content:
            ${content}

            Respond with only:
            - "fully" — if the item is **clearly and explicitly** addressed.
            - "partially" — if the item is **weakly mentioned, implied, or vaguely present**.
            - "missing" — if the item is **not covered at all**.

            Return only: fully, partially, or missing.
        `;

        // const response = await openai.chat.completions.create({
        //     model: "gpt-4-turbo",
        //     messages: [
        //         { role: "user", content: prompt },
        //         { role: "system", content: "You are an expert SEO content verifier." }
        //     ],
        //     temperature: 0,
        // });

        const response = await openai.chat.completions.create({
            messages: [
                { role: "user", content: prompt },
                { role: "system", content: "You are an expert SEO content verifier." }
            ],
            temperature: 0.2,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
        });

        const result = response.choices[0].message.content;
        if (!result) return "missing";
        
        const trimmedResult = result.trim().toLowerCase();
        if (["fully", "partially", "missing"].includes(trimmedResult)) {
            return trimmedResult as VerificationStatus;
        }
        return "missing";
    } catch (error) {
        console.error(`❌ Error verifying \"${item}\" (${type}):`, error);
        return 'missing'; // fail-safe fallback
    }
}

export async function verifyContentWithSeoBrief(
    content: string,
    seoBrief: SeoBrief,
    language?: string
) {
    // If content is empty, return empty results without making any API calls
    if (!content.trim()) {
        return {
            objective: [],
            mainTopics: [],
            importantQuestions: [],
            writingStyleAndTone: [],
            recommendedStyle: [],
            valueProposition: [],
            improvementText: ""
        };
    }

    const verificationResult: Record<keyof SeoBrief, any> = {
        objective: 'missing',
        mainTopics: '[]',
        importantQuestions: '[]',
        writingStyleAndTone: '[]',
        recommendedStyle: '[]',
        valueProposition: '[]',
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
                    const status = await verifyItemPresence(content, label, item);
                    return status;
                })
            )
        );
        verificationResult[key] = items.map((item, idx) => ({
            item,
            status: results[idx],
        }));
        
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
            Given the following SEO brief and article content, provide concise improvement suggestions.
            ${language ? `Please provide your response in ${language} language.` : ''}

            SEO Brief:
            - Objective: ${seoBrief.objective.join(", ")}
            - Main Topics: ${seoBrief.mainTopics.join(", ")}
            - Important Questions: ${seoBrief.importantQuestions.join(", ")}
            - Writing Style and Tone: ${seoBrief.writingStyleAndTone.join(", ")}
            - Recommended Style: ${seoBrief.recommendedStyle.join(", ")}
            - Value Proposition: ${seoBrief.valueProposition.join(", ")}

            Content:
                ${content}

            Provide 3-4 focused improvement suggestions. Each suggestion should be 1-2 sentences long and address a specific aspect:
            - Content coverage and depth
            - Structure and organization
            - Writing style and tone
            - Missing elements or gaps

            Keep the response concise and actionable. Focus on the most important improvements needed.
        `;

        const suggestionResponse = await openai.chat.completions.create({
            messages: [
                { role: "user", content: suggestionPrompt },
                { role: "system", content: "You are an expert SEO content reviewer. Provide concise, actionable feedback." }
            ],
            max_tokens: 500,  // Reduced back to 500 since we want concise responses
            temperature: 0.2,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
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
