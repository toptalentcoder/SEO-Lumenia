import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSeoBrief(query: string) {
    const prompt = `
        Generate a comprehensive SEO brief for the query: ${query}

        The SEO brief should have the following structure:

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
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
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
    const sectionRegex = /(\d+)\.\s*\*\*(.*?)\*\*:\s*-\s*([\s\S]*?)(?=\d+\.\s|\n{2,}|$)/gs;
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
            case 'Writing Style and Tone':
                seoBrief.writingStyleAndTone = sectionValue.split(',').map(style => style.trim());
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
