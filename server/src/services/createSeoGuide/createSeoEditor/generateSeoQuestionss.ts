import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from '@/config/apiConfig';

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateSeoQuestions({
    query,
    keywords,
    language = "English"
}: {
    query: string;
    keywords: string[];
    language?: string;
}): Promise<string[]> {
    const prompt = `

        Based on the topic: "${query}" and the following keywords:
        ${keywords.join(', ')}

        Generate 20 SEO-optimized FAQ-style questions in ${language}. The questions should:
        - Be helpful and conversational
        - Use relevant industry terms and product names from the keywords
        - Include a mix of search intent: comparison, how-to, technical explanation, problems, reviews
        - Cover SEO-rich angles: "kill switch", "split tunneling", "money-back guarantee", "free vs premium", "speed test", etc.
        - Be suitable for use in featured snippets or People Also Ask sections
        - Be written in ${language} language

        Format:
        1. [question 1]
        2. [question 2]
        ...
    `;

    const options = {
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_API_KEY,
        deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
        apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
    };

    const openai = new AzureOpenAI(options)

    // const response = await openai.chat.completions.create({
    //     model: 'gpt-4-turbo',
    //     messages: [
    //         { role: 'user', content: prompt },
    //         { role: 'system', content: 'You are an expert SEO content strategist.' }
    //     ],
    //     temperature: 0.3,
    // });

    const response = await openai.chat.completions.create({
        messages: [
            { role: 'user', content: prompt },
            { role: 'system', content: 'You are an expert SEO content strategist.' }
        ],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    const text = response.choices[0].message.content;
    return text?.split(/\n\d+\.\s+/).filter(q => q.trim() !== "") ?? [];
}
