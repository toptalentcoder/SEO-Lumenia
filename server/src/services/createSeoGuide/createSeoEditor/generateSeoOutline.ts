import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from '@/config/apiConfig';

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateSeoOutline({
    query,
    keywords,
    language = "English"
}: {
    query: string;
    keywords: string[];
    language?: string;
}): Promise<string[]> {
    const prompt = `

        Generate a detailed, hierarchical outline for an SEO article based on the query: "${query}".
        The outline should be in ${language} language.

        Use the following keywords where appropriate: ${keywords.join(', ')}

        Format the outline as:
        1. Title
        1.1 Section Title
        1.1.1 Subsection Title
        ...

        Include common SEO content blocks like:
        - Introduction (definitions, importance)
        - Technical explanations (how it works, features)
        - Comparisons between products/services
        - Buyer considerations (what to look for)
        - Recommendations and examples

        Make the outline comprehensive but not too long (max 5 main sections).
        All content should be in ${language} language.
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
  // Split on each line and keep only numbered ones
  return text
    ?.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^\d+(\.\d+)*\s/.test(line)) ?? [];
}
