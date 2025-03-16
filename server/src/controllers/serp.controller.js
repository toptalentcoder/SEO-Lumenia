import { getJson } from 'serpapi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import natural from 'natural';
import sw from 'stopword';
import { OpenAI } from 'openai';

// Initialize tokenizer and stemmer globally
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Initialize the OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key
});

// Main Google Search API
export const googleSearchAPI = async (req, res) => {
    const { query } = req.body;

    const SERP_API_KEY = process.env.SERP_API_KEY;

    getJson(
        {
            engine: "google",
            q: query,
            api_key: SERP_API_KEY,
        },
        async (json) => {
            const response = json["organic_results"];

            const titleMap = new Map();

            // Extract title and link
            response.forEach(item => {
                const formattedTitle = `${item.title} | ${item.source}`;

                if (titleMap.has(item.title)) {
                    titleMap.set(item.title, [...titleMap.get(item.title), { title: formattedTitle, link: item.link }]);
                } else {
                    titleMap.set(item.title, [{ title: formattedTitle, link: item.link }]);
                }
            });

            // Flatten the map and include both title and link
            const extractedData = Array.from(titleMap.values()).flat();

            // Extract only links for TF-IDF score
            const links = response.map(item => item.link);

            // Scrape and process the content from each URL
            const pageTexts = await Promise.all(links.map(link => fetchPageContent(link)));

            // Step 1: Process the text (Lowercase, punctuation removal, tokenization, stopword removal)
            const processedText = pageTexts.map(text => processText(text));

            // Step 2: Extract top 50 words based on TF-IDF from all scraped pages
            const keywords = extractWords(processedText);

            // Step 4: Use OpenAI for deeper semantic analysis
            const semanticKeywords = await getSemanticKeywords(keywords, query);

            // Fetch keyword frequency per URL
            const keywordDistributions = await Promise.all(
                links.map(link => fetchPageContentForKeywordFrequency(link, semanticKeywords))
            );

            // Compute optimization levels
            const optimizationLevels = calculateOptimizationLevels(keywordDistributions);


            res.json({ optimizationLevels });
        }
    );
};

// Fetch page content from the URL
const fetchPageContent = async(url) => {
    try {
        const response = await axios.get(url);

        const html = response.data;

        const $ = cheerio.load(html);

        let textContent = '';
        $('p').each((i, element) => {
            textContent += $(element).text() + ' ';
        });

        return textContent;
    } catch (error) {
        console.error('Error Scraping the page:', error);
    }
};

// Preprocess text (lowercase, remove punctuation, tokenize, and remove stopwords)
const processText = (text) => {

    if (!text) {
        console.error("Received undefined or empty text for processing");
        return [];
    }

    let processedText = text.toLowerCase();
    processedText = processedText.replace(/[^\w\s]/g, ""); // Remove punctuation
    const tokens = tokenizer.tokenize(processedText);
    return sw.removeStopwords(tokens); // Remove stopwords
};

// Extract top 50 words based on TF-IDF
const extractWords = (documents) => {
    let tfidf = new natural.TfIdf();

    // Add each document to the TF-IDF model
    documents.forEach(doc => tfidf.addDocument(doc.join(" ")));

    let wordScores = {};

    // Compute TF-IDF scores for all words
    documents.forEach((doc, index) => {
        doc.forEach(word => {
            let score = tfidf.tfidf(word, index);
            if (!wordScores[word]) wordScores[word] = 0;
            wordScores[word] += score;
        });
    });

    // Return all words (ignoring scores), sorted by highest TF-IDF score
    return Object.keys(wordScores).sort((a, b) => wordScores[b] - wordScores[a]).slice(0, 100);
};

// Get semantic related keywords using OpenAI embeddings
async function getSemanticKeywords(keywords, baseQuery) {
    const baseEmbedding = await getEmbedding(baseQuery);
    let keywordSimilarityScores = [];

    for (let keyword of keywords) {
        let keywordEmbedding = await getEmbedding(keyword);
        let similarity = cosineSimilarity(baseEmbedding, keywordEmbedding);

        // Only consider semantic keywords with a high enough similarity
        if (similarity > 0.7) { // You can adjust this threshold if needed
            keywordSimilarityScores.push({ keyword, similarity });
        }
    }

    // Sort the keywords by similarity score in descending order and return top 50
    keywordSimilarityScores.sort((a, b) => b.similarity - a.similarity);

    // Return only the top 50 semantic keywords
    return keywordSimilarityScores.slice(0, 50).map(item => item.keyword);
}

// Get OpenAI embeddings for a word
async function getEmbedding(word) {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: word,
    });
        // Ensure the response has the expected structure
        if (response && response.data && response.data.length > 0) {
            return response.data[0].embedding;  // Get the embedding vector
        } else {
            throw new Error('Invalid response from OpenAI API');
        }
}

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
    let dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    let magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    let magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Fetch page content and count keyword frequencies
const fetchPageContentForKeywordFrequency = async (url, keywords) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let textContent = '';
        $('p').each((i, element) => {
            textContent += $(element).text() + ' ';
        });

        // Process text
        const tokens = processText(textContent);

        // Count keyword frequencies
        let keywordCounts = {};
        keywords.forEach(keyword => {
            keywordCounts[keyword] = tokens.filter(word => word === keyword).length;
        });

        return keywordCounts;
    } catch (error) {
        console.error('Error Scraping the page:', error);
        return {};
    }
};

function calculateOptimizationLevels(keywordDistributions) {
    let keywordStats = {};

    // Organize keyword frequencies across all URLs
    for (let i = 0; i < keywordDistributions.length; i++) {
        let keywordCounts = keywordDistributions[i];

        for (let keyword in keywordCounts) {
            if (!keywordStats[keyword]) keywordStats[keyword] = [];
            keywordStats[keyword].push(keywordCounts[keyword]);
        }
    }

    let optimizationLevels = {};

    for (let keyword in keywordStats) {
        let frequencies = keywordStats[keyword];

        // Compute Mean and Standard Deviation
        let mean = frequencies.reduce((sum, f) => sum + f, 0) / frequencies.length;
        let stdDev = Math.sqrt(frequencies.reduce((sum, f) => sum + Math.pow(f - mean, 2), 0) / frequencies.length);

        // Define Optimization Ranges
        let subOptimizedMax = mean - 0.5 * stdDev;
        let standardOptimizedMin = mean - 0.5 * stdDev;
        let standardOptimizedMax = mean + 0.5 * stdDev;
        let strongOptimizedMin = mean + 0.5 * stdDev;
        let strongOptimizedMax = mean + 1.5 * stdDev;
        let overOptimizedMin = mean + 1.5 * stdDev;

        // Store Optimization Ranges
        optimizationLevels[keyword] = {
            "subOptimized": `≤ ${Math.round(subOptimizedMax)}`,
            "standardOptimized": `${Math.round(standardOptimizedMin)} ~ ${Math.round(standardOptimizedMax)}`,
            "strongOptimized": `${Math.round(strongOptimizedMin)} ~ ${Math.round(strongOptimizedMax)}`,
            "overOptimized": `≥ ${Math.round(overOptimizedMin)}`
        };
    }

    return optimizationLevels;
}
