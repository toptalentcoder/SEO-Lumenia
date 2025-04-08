import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: "system", content: prompt },
            { role: "user", content: seoContent }
        ],
        temperature: 0.2,
    });

    const classification = response.choices[0].message.content;
    return new Response(JSON.stringify({ categories: classification }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
