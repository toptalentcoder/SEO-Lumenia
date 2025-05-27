import { seedKeywordsMap } from '@/globals/seedKeywordsMap';
<<<<<<< HEAD
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey : process.env.OPENAI_API_KEY });
=======
import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from '@/config/apiConfig';

// const openai = new OpenAI({ apiKey : OPENAI_API_KEY });
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

export async function generateKeywordsForSERPWeatherCategory(category : string) : Promise<string[]> {

    const seeds = seedKeywordsMap[category] || [];

    const seedText = seeds.length
        ? `\n\nHere are example seed keywords to guide your generation:\n- ${seeds.join("\n- ")}\n`
        : "";

    const prompt = `
        Generate a list of 10 high-quality, SEO-relevant keywords for the "${category}" category.
        Each keyword must:
            - Be a popular search query that a user might enter into Google.
            - Be suitable for rank tracking or SERP volatility monitoring
            - Focued on informational, commercial, or navigational intent.
            - Avoid placeholder text. Output only the keyword phrases, comma-separated.
            Return the output as a comma-separated flat list with no numbering.
        ${seedText}
    `

<<<<<<< HEAD
    const response = await openai.chat.completions.create({
        model : 'gpt-4',
        messages : [{ role : 'user', content : prompt }],
        temperature : 0.7,
=======
    const options = {
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_API_KEY,
        deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
        apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
    };

    const openai = new AzureOpenAI(options);

    // const response = await openai.chat.completions.create({
    //     model : 'gpt-4-turbo',
    //     messages : [
    //         { role : 'user', content : prompt },
    //         { role : 'system', content : 'You are an expert SEO keyword generation assistant.' }
    //     ],
    //     temperature : 0.1,
    // });

    const response = await openai.chat.completions.create({
        messages : [
            { role : 'user', content : prompt },
            { role : 'system', content : 'You are an expert SEO keyword generation assistant.' }
        ],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
    });

    const text = response.choices[0].message?.content ?? "";
    return text.split(",").map(k => k.trim()).filter(k => k.length > 0).slice(0, 10);

}