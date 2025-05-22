import { OpenAI, AzureOpenAI } from 'openai';
import { AZURE_OPENAI_API_GPT_4_1_MODELNAME, AZURE_OPENAI_API_GPT_4_1_VERSION, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_GPT_4_1, AZURE_OPENAI_ENDPOINT, OPENAI_API_KEY } from '@/config/apiConfig';

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const categories = [
    "Business and Economy",
    "Computer Science / IT",
    "Arts",
    "Entertainment",
    "Society",
    "Fashion",
    "Science",
    "Health",
    "Education",
    "Travel",
    "Food",
    "Sports",
    "Politics",
    "Environment",
    "Law",
    "Real Estate",
    "Finance"
];

export async function generateSeoCategory({
    seoContent
}: {
    seoContent : string
}): Promise<Response> {
    const prompt = `
        You are an expert SEO category classifier.
        Classify the following text into one or more of the following categories:
        ${categories.join(', ')}.

        Only return the best-matching category or categories. Avoid unnecessary explanations.
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
    //         { role: "system", content: prompt },
    //         { role: "user", content: seoContent }
    //     ],
    //     temperature: 0.2,
    // });

    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: prompt },
            { role: "user", content: seoContent }
        ],
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model : AZURE_OPENAI_API_GPT_4_1_MODELNAME,
    });

    const classification = response.choices[0].message.content;
    return new Response(JSON.stringify({ categories: classification }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
