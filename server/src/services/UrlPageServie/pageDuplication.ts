import { fetchHTML } from './fetchHtml';
import { getOrFetchInternalUrls } from './getOrFetchInternalPageUrls';
import { Payload } from 'payload';
import * as cheerio from 'cheerio';

function extractMainContent(html: string): string {
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style').remove();
    
    // Get text from main content areas
    const mainContent = $('main, article, .content, #content').text() || $('body').text();
    
    // Clean up the text
    return mainContent
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function calculateSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    // Simple text similarity calculation using Jaccard similarity
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return (intersection.size / union.size) * 100;
}

export async function detectPageDuplication(baseUrl: string, payload: Payload) {
    const { urls, rootHTML } = await getOrFetchInternalUrls(baseUrl, payload);
    
    if (!urls.length) return [];
    
    // Get content of all pages
    const pageContents = await Promise.all(
        urls.map(async url => {
            const html = await fetchHTML(url);
            return {
                url,
                content: html ? extractMainContent(html) : ''
            };
        })
    );
    
    // Compare each page with every other page
    const duplicates: { url1: string; url2: string; similarity: number }[] = [];
    
    for (let i = 0; i < pageContents.length; i++) {
        for (let j = i + 1; j < pageContents.length; j++) {
            const similarity = calculateSimilarity(
                pageContents[i].content,
                pageContents[j].content
            );
            
            if (similarity > 70) { // Threshold for considering pages as duplicates
                duplicates.push({
                    url1: pageContents[i].url,
                    url2: pageContents[j].url,
                    similarity: Math.round(similarity)
                });
            }
        }
    }
    
    return duplicates.sort((a, b) => b.similarity - a.similarity);
} 