const { OpenAI } = require("openai");

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

export async function generateSEOKeywords(query : string, location : string, language : string) {
    const keywords = [];

    // Example: Generate keywords for "pizza dough recipe" in the UK market, in English.
    const prompt = `
    You are an SEO keyword research assistant. Using the input query "${query}" in ${language} for the ${location} market, generate a comprehensive list of at least 400 semantically related keyword phrases. Include a diverse mix covering all search intent types: informational (questions, how-tos, etc.), commercial (comparative or investigational queries), transactional (purchase or action-oriented queries), and navigational (brand or site-specific queries). The keywords should be highly relevant to "${query}" and include synonyms, long-tail variations, and related topics, similar to how SEO tools (like Semrush or Ahrefs) cluster keywords by topic and relevance.

    **Output format:** Provide the results as a single JSON object with "${query}" as the key and an array of unique keyword strings as the value. Do not include any explanations, only the JSON. For example: { "${query}": [ "keyword1", "keyword2", ... ] }. Make sure no extra text or metrics are included – just the keywords optimized for SEO content integration.
    `;

    // Request using OpenAI Node SDK
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2048,
            temperature: 0.7
        });

        const keywordList = response.choices[0].message.content.trim();
        
        return keywordList;
    } catch (error) {
        console.error("Error generating SEO keywords:", error);
    }
}