import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function createSocialPost({
    query,
    tone,
    platform,
    content
}: {
    query: string;
    tone: string;
    platform: string;
    content: string | string[];
}): Promise<{socialMedia : string; tone : string; text : string; language : string}> {
    // Define tone and platform mappings for context
    const tone_map: { [key: string]: string } = {
        'friendly': "Write in a casual, warm, and welcoming style, like you're talking to a friend.",
        'professional': "Write in a formal and business-like style, suitable for professionals.",
        'cheerful': "Write in an upbeat, energetic, and positive tone with a friendly vibe.",
        'informative': "Write in a detailed, educational, and factual style, providing helpful information.",
        'casual': "Write in a relaxed, easy-going tone, like chatting with a peer.",
        'motivational': "Write in an inspiring and encouraging style, motivating the audience.",
        'humorous': "Write with a lighthearted and funny tone to engage the audience.",
        'inspirational': "Write in an uplifting, motivating, and encouraging style that inspires the audience to take action, believe in themselves, or strive for success. Focus on positive energy and empowering messages.",
        'empathetic': "Write in a compassionate, understanding, and supportive tone. Show care and concern, making the reader feel heard and validated. Offer comfort, encouragement, or solidarity with their challenges.",
        'concise': "Write in a brief, to-the-point style, eliminating unnecessary details. Focus on delivering the message clearly and effectively, using the fewest words necessary to convey the idea.",
        'sharp': "Write in a direct, assertive, and impactful tone. The message should be clear, no-nonsense, and precise, cutting through fluff and getting to the heart of the matter quickly.",
        'smart': "Write in a clever, insightful, and articulate manner. The tone should reflect intelligence and thoughtfulness, offering well-reasoned ideas or perspectives in a polished and sophisticated way."
    };

    // Handle content being either a string or an array
    const contentString = Array.isArray(content)
        ? content.map((item, index) => `${index + 1}. ${item}`).join("\n")  // If it's an array, format it as numbered list
        : content;  // If it's a string, use it directly

    // Build the prompt dynamically based on the platform and query content
    let prompt: string;

    if (platform === 'x') {
        prompt = `
            Create a ${tone_map[tone]} Twitter post about the following topic: "${query}".
            The post should be concise (up to 280 characters), include relevant hashtags and emojis.
            Here’s the content to reference:
            ${contentString}
            The post should be catchy and encourage engagement.
        `;
    } else if (platform === 'linkedin') {
        prompt = `
            Create a ${tone_map[tone]} LinkedIn post about the following topic: "${query}".
            The post should be conversational, engaging, and provide value. Make sure it’s detailed, offering insights into the topic.
            It should encourage readers to reflect on the topic and share their experiences or thoughts.
            Here’s the content to reference:
            ${contentString}
        `;
    } else if (platform === 'facebook') {
        prompt = `
            Create a fun and engaging Facebook post about the following topic: "${query}".
            The post should be lighthearted, with a mix of humor and relatable commentary. It should be engaging and conversational, encouraging users to interact with the post by commenting, liking, and sharing their experiences.
            Here’s the content to reference:
            ${contentString}
            The post should feel like a friendly conversation, with an engaging and slightly humorous tone that encourages sharing of experiences.
        `;
    } else {
        prompt = `
            Create a ${tone_map[tone]} post for ${platform} about the topic: "${query}".
            The post should be engaging and appropriate for the platform.
            Here’s the content to reference:
            ${contentString}
        `;
    }

    // Call the OpenAI API with chat completions
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    // Get the content of the generated response
    const text = response.choices[0].message.content;

    return {
        socialMedia: platform || "",
        tone: tone || "",
        language: "en",
        text: text || ""
    };
}
