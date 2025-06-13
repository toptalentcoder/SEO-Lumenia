import { AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT } from '@/config/apiConfig';

const CATEGORY_LIST = [
    "Business & Industrial",
    "Food & Groceries",
    "News, Media & Publications",
    "Finance",
    "Hobbies & Leisure",
    "Health",
    "Travel & Tourism",
    "Arts & Entertainment",
    "Family & Community",
    "Law & Government",
    "Jobs & Education"
];

export async function classifyKeywordCategory(keyword : string) : Promise<string> {

    const prompt = `Classify the keyword "${keyword}" into one of the following categories: ${CATEGORY_LIST.join(", ")}. Only return the category name.`;

    const options = {
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_API_KEY,
        deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
        apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
    };

    const openai = new AzureOpenAI(options);

    const response = await openai.chat.completions.create({
        messages : [
            { role : 'user', content : prompt },
            { role : 'system', content : 'You are a helpful classifier.' }
        ],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    const category = response.choices?.[0]?.message?.content?.trim();

    return CATEGORY_LIST.includes(category!) ? category! : "Business & Industrial";
}