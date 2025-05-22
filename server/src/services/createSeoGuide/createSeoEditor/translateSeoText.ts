import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from "@/config/apiConfig";

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    const prompt = `Translate the following SEO blog content to ${targetLanguage}. Keep formatting and bullet points where possible:\n\n${text}`;

    const options = {
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_API_KEY,
        deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
        apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
    };

    const openai = new AzureOpenAI(options);

    // const chat = await openai.chat.completions.create({
    //     model: "gpt-4-turbo",
    //     messages: [{ role: "user", content: prompt }],
    // });


    const chat = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    return chat.choices[0]?.message.content || "";
}
