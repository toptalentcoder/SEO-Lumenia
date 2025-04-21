import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define categories for classification
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

/**
 * Categorizes a URL based on its content and the search query
 * @param url The URL to categorize
 * @param title The title of the page
 * @param content The content of the page
 * @param query The search query that led to this URL
 * @param language The language of the query
 * @returns A promise that resolves to an array of categories
 */
export async function categorizeUrl(
    url: string,
    title: string,
    content: string,
    query: string,
    language: string
): Promise<string[]> {
    // If content is empty or too short, use just the title and URL
    const contentToAnalyze = content && content.length > 100 
        ? content.substring(0, 1000) // Limit content length for API efficiency
        : `${title} ${url}`;

    const prompt = `
        You are an expert SEO category classifier.
        Based on the following URL, title, content snippet, and search query, classify this page into categories from these options:
        ${categories.join(', ')}.
        
        URL: ${url}
        Title: ${title}
        Search Query: ${query}
        Content Snippet: ${contentToAnalyze}
        
        Rules for categorization:
        1. ALWAYS return AT LEAST ONE category - this is mandatory
        2. ONLY add additional categories if the content is STRONGLY relevant to multiple distinct categories
        3. Do not add extra categories just because you're unsure - stick to the most relevant one
        4. Return categories as a comma-separated list, with no additional text or explanation
        5. If you can't determine any category, return "Uncategorized"
        6. IMPORTANT: Return all categories in ${language} language, matching the query language
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                { role: "system", content: prompt }
            ],
            temperature: 0.2,
        });

        const categoriesText = response.choices[0].message.content || "Uncategorized";
        const categoriesList = categoriesText.split(',').map(cat => cat.trim()).filter(Boolean);
        
        // Ensure we always have at least one category
        return categoriesList.length > 0 ? categoriesList : ["Uncategorized"];
    } catch (error) {
        console.error("Error categorizing URL:", error);
        return ["Uncategorized"];
    }
}

/**
 * Categorizes multiple URLs in parallel
 * @param urls Array of URLs with their titles and content
 * @param query The search query that led to these URLs
 * @param language The language of the query
 * @returns A promise that resolves to an array of category arrays
 */
export async function categorizeUrls(
    urls: { url: string; title: string; content: string }[],
    query: string,
    language: string
): Promise<string[][]> {
    // Process URLs in batches to avoid rate limiting
    const batchSize = 3; // Reduced batch size to avoid rate limiting
    const results: string[][] = [];
    const maxRetries = 2; // Maximum number of retries for failed batches
    
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        let retryCount = 0;
        let batchResults: string[][] = [];
        
        while (retryCount <= maxRetries) {
            try {
                const batchPromises = batch.map(item => 
                    categorizeUrl(item.url, item.title, item.content, query, language)
                );
                
                batchResults = await Promise.all(batchPromises);
                break; // Success, exit retry loop
            } catch (error) {
                retryCount++;
                console.error(`Error processing batch ${i/batchSize + 1}, attempt ${retryCount}:`, error);
                
                if (retryCount > maxRetries) {
                    // If all retries failed, use fallback categories
                    console.warn(`Using fallback categories for batch ${i/batchSize + 1} after ${maxRetries} retries`);
                    batchResults = batch.map(() => ["Uncategorized"]);
                } else {
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                }
            }
        }
        
        results.push(...batchResults);
        
        // Add a small delay between batches to avoid rate limiting
        if (i + batchSize < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    return results;
} 