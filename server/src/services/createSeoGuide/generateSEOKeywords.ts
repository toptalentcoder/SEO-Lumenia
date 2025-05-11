
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSeoPrompt(query: string, language: string, country: string): string {
  return `
You are an SEO keyword research assistant.

Using the input query "${query}" in ${language} for the ${country} market, generate a list of at least 400 semantically related keyword phrases. Include a diverse mix of search intents: informational (e.g., questions, how-tos), commercial (comparisons, intent to investigate), transactional (ready to buy), and navigational (brand/site queries).

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
  const prompt = buildSeoPrompt(query, language, country);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 3000,
  });

  const raw = response.choices?.[0]?.message?.content || '';
  const keywords = parseKeywordList(raw);

  return keywords;
}

