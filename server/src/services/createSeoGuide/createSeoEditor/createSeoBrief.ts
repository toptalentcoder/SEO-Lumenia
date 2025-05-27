import { OpenAI, AzureOpenAI } from "openai";
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT } from "@/config/apiConfig";

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const options = {
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_API_KEY,
    deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
    apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
};

const openai = new AzureOpenAI(options);

export async function generateSeoBrief(query: string, language: string) {
    const prompt = `
        Generate a comprehensive SEO brief for the query: ${query}.

        The SEO brief should have the following structure. The content of the SEO brief should be written in ${language}, but the section headings must remain in English exactly as shown:

        1. **Primary Intent**:
            - Provide a single word (e.g., "Informational", "Transactional").

        2. **Objective**:
            - Provide a concise, 3-4 sentence description of the content's objective.

        3. **Main Topics to Cover**:
            - List 4-5 key topics the content should cover. Each topic should be listed without any numbering or additional prefixes, just the topic name/description.
            - Example:
            - Importance of choosing the right swimming shorts for training.
            - Key features to look for in swimming shorts for training.
            - Review of top swimming shorts brands.

        4. **Important Questions to Address**:
            - List 4-5 important questions that should be answered in the content. These should be direct questions without any numbering or prefixes.
            - Example:
            - What are the best brands of swimming shorts for training?
            - What features should I look for when purchasing swimming shorts for training?
            - Where can I buy the best swimming shorts for training?

        5. **Writing Style and Tone**:
            - Recommend 2-3 styles from the following list: "Friendly", "Professional", "Casual", "Informative", etc.

        6. **Recommended Style**:
            - Provide a description of the writing style. Be clear, concise, and engaging.

        7. **Value Proposition**:
            - Provide 3-4 sentences explaining why this content is valuable to the reader.
    `;

    // OpenAI GPT-4 API call to generate the SEO brief
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    // Log the raw response for debugging
    const seoBriefRaw = response.choices?.[0]?.message?.content ?? "Error generating SEO brief";

    const seoBrief: {
        primaryIntent: string;
        objective: string[];
        mainTopics: string[];
        importantQuestions: string[];
        writingStyleAndTone: string[];
        recommendedStyle: string[];
        valueProposition: string[];
    } = {
        primaryIntent: "",
        objective: [],
        mainTopics: [],
        importantQuestions: [],
        writingStyleAndTone: [],
        recommendedStyle: [],
        valueProposition: [],
    };

    // Updated regex to capture multi-line lists
    // const sectionRegex = /(\d+)\.\s*\*\*(.*?)\*\*:\s*-\s*([\s\S]*?)(?=\d+\.\s|\n{2,}|$)/gs;
    const sectionRegex = /(\d+)\.\s*\*\*(.*?)\*\*:\s*(?:-?\s*)?\n?([\s\S]*?)(?=\n\d+\.\s\*\*|$)/g;

    let match;
    while ((match = sectionRegex.exec(seoBriefRaw)) !== null) {
        const sectionKey = match[2].trim();  // Exact section key (no normalization)
        const sectionValue = match[3].trim();  // Clean up the value

        // Assign values to the appropriate sections
        switch (sectionKey) {
            case 'Primary Intent':
                seoBrief.primaryIntent = sectionValue;
                break;
            case 'Objective':
                seoBrief.objective = sectionValue.split('.').map(sentence => sentence.trim()).filter(sentence => sentence);
                break;
            case 'Main Topics to Cover':
                seoBrief.mainTopics = sectionValue.split('\n').map(topic => topic.trim().replace(/^-?\s*/, '')).filter(topic => topic);
                break;
            case 'Important Questions to Address':
                seoBrief.importantQuestions = sectionValue.split('\n').map(question => question.trim().replace(/^-?\s*/, '')).filter(question => question);
                break;
            // case 'Writing Style and Tone':
            //     seoBrief.writingStyleAndTone = sectionValue.split(',').map(style => style.trim());
            //     break;
            case 'Writing Style and Tone':
                seoBrief.writingStyleAndTone = sectionValue.split('\n').map(style => style.trim()).filter(Boolean);
                break;
            case 'Recommended Style':
                seoBrief.recommendedStyle = sectionValue.split('.').map(sentence => sentence.trim()).filter(sentence => sentence);
                break;
            case 'Value Proposition':
                seoBrief.valueProposition = sectionValue.split('.').map(sentence => sentence.trim()).filter(sentence => sentence);
                break;
            default:
                break;
        }
    }

    return seoBrief;
}
