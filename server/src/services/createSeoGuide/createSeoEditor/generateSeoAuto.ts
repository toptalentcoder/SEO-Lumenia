import { OpenAI, AzureOpenAI } from "openai";
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from "@/config/apiConfig";

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function autoExpandSeoText(rawContent: string, language: string = "English"): Promise<string> {
    const prompt = `
        Take the following content and enhance it to be more semantically complete, natural-sounding, and optimized for SEO. Expand the points with helpful, specific, and engaging phrasing. Don't remove the structure — just enrich each part with meaningful detail.
        The content should be written in ${language} language.

        Here is the content:

        ${rawContent}

        Return the rewritten version only, ensuring it is in ${language} language.
    `;

    const options = {
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_API_KEY,
        deploymentName: AZURE_OPENAI_DEPLOYMENT_GPT_4_1,
        apiVersion: AZURE_OPENAI_API_GPT_4_1_VERSION
    };

    const openai = new AzureOpenAI(options)

    // const response = await openai.chat.completions.create({
    //     model: "gpt-4-turbo",
    //     messages: [
    //         { role: "user", content: prompt },
    //         { role: "system", content: "You are an expert SEO content writer." }
    //     ],
    //     temperature: 0.7,
    // });

    const response = await openai.chat.completions.create({
        messages: [
            { role: "user", content: prompt },
            { role: "system", content: "You are an expert SEO content writer." }
        ],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    return response.choices?.[0]?.message?.content ?? "";
}
