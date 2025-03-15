import { getJson } from 'serpapi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import natural from 'natural';
import sw from 'stopword';

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

            //extract title and link
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

            //extract only links for TF-IDF score
            const links = response.map(item => item.link);

            //Scrape and process the content from each URL
            const pageTexts = await Promise.all(links.map(link => fetchPageContent(link)));

            //Step 1: Process the text (Lowercase, punctuation removal, tokenization, stopword removal)
            const processedText = pageTexts.map(text => processText(text));

            // Step 2 : Extract top 50 words based on TF-IDF from all scraped pages
            const top50Words = extractTop50Words(processedText);

            res.json(top50Words);
        }
    );
}

// Fetch page content from the URL
const fetchPageContent = async(url) => {
    try{
        const response = await axios.get(url);

        const html = response.data;

        const $ = cheerio.load(html);

        let textContent = '';
        $('p').each((i, element) => {
            textContent += $(element).text() + ' ';
        });

        return textContent;
    }catch(error){
        console.error('Error Scraping the page : ', error);
    }
}

// Preprocess text (lowercase, remove punctuation, tokenize, and remove stopwords)
const processText = (text) => {

    if (!text) {
        console.error("Received undefined or empty text for processing");
        return [];
    }

    let processedText = text.toLowerCase();
    processedText = processedText.replace(/[^\w\s]/g, ""); // Remove punctuation
    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(processedText);
    tokens = sw.removeStopwords(tokens); // Remove stopwords
    return tokens;
}

// Extract top 50 words based on TF-IDF
const extractTop50Words = (documents) => {
    const tfidf = new natural.TfIdf();

    // Add documents to the TF-IDF model
    documents.forEach(doc => tfidf.addDocument(doc));

    // Get TF-IDF scores for terms in the first document
    const terms = [];

    // with term and tfidf score
    // tfidf.listTerms(0).forEach(term => {
    //     terms.push({ term: term.term, tfidf: term.tfidf });
    // });

    tfidf.listTerms(0).forEach(term => {
        terms.push(term.term);
    });


    // Sort terms by TF-IDF score in descending order
    // terms.sort((a, b) => b.tfidf - a.tfidf);

    // Return the top 50 words
    return terms.slice(0, 50);
};