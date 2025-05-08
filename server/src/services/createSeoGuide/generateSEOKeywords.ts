import { OpenAI } from "openai";

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
            max_tokens: 4096,
            temperature: 0.7
        });

        const content = response.choices[0].message.content?.trim() ?? "";
        console.log("📤 Raw OpenAI response:\n", content.slice(0, 500));

        // Try to extract the JSON object (including nested brackets)
        const match = content.match(/\{\s*"[^"]+"\s*:\s*\[\s*([\s\S]*?)\]\s*\}/);
    
        if (!match) throw new Error("❌ No valid JSON object found in response.");
    
        // Add back the brackets to make a complete object
        const jsonText = `{ "${query}": [${match[1]}] }`;
    
        const parsed = JSON.parse(jsonText);
        const keywords = parsed[query];
    
        if (!Array.isArray(keywords)) throw new Error("Parsed result is not a valid keyword array");
    
        return keywords;
        
    } catch (error) {
        console.error("Error generating SEO keywords:", error);
    }
}