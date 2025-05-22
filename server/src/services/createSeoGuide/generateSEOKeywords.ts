import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from '@/config/apiConfig';

// if (!OPENAI_API_KEY) {
//     throw new Error('OPENAI_API_KEY is not configured');
// }

// const openai = new OpenAI({
//     apiKey: OPENAI_API_KEY,
// });

function buildSeoPrompt(query: string, language: string, country: string): string {
  return `
        Using the input query "${query}" in ${language} for the ${country} market, generate a list of semantically related keyword phrases. Include a diverse mix of search intents: informational (e.g., questions, how-tos), commercial (comparisons, intent to investigate), transactional (ready to buy), and navigational (brand/site queries).

        Return only the keywords in plain text format, **one per line**, with no JSON, no quotes, no markdown, and no explanations.

        Example:
        keyword 1  
        keyword 2  
        keyword 3  
        ...
    `;
}

function parseKeywordList(raw: string): string[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && /^[\w\d]/.test(line)); // remove blanks and invalids
}

export async function generateSEOKeywords(query: string, country: string, language: string): Promise<string[]> {
    try {
        const prompt = buildSeoPrompt(query, language, country);

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
        //         { role: 'system', content: 'You are an SEO keyword research assistant.' },
        //         { role: 'user', content: prompt }
        //     ],
        //     temperature: 0.3,
        //     max_tokens: 2800,
        // });

        const response = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are an SEO keyword research assistant.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 2800,
            temperature: 0.2,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
        });

        if (!response.choices?.[0]?.message?.content) {
            console.error('OpenAI returned empty response');
            return [];
        }

        const raw = response.choices[0].message.content;
        
        const keywords = parseKeywordList(raw);

        if (keywords.length === 0) {
            console.warn('No valid keywords were parsed from the response');
        }

        return keywords;
    } catch (error) {
        console.error('Error in generateSEOKeywords:', error);
        throw error; // Re-throw to handle in processSeoGuide
    }
}