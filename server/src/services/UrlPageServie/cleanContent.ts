// src/utils/cleanContent.ts
import * as cheerio from 'cheerio';

/**
 * Extracts and normalizes meaningful textual content from a web page.
 * Removes boilerplate sections like nav, header, footer, ads, etc.
 */
export function cleanContent(html: string): string {
    const $ = cheerio.load(html);

    // Remove noisy or non-content elements
    $('header, footer, nav, script, style, noscript, iframe, aside, .ads, .sidebar, .footer, .header, .navigation').remove();

    // Extract text content
    const rawText = $('body').text();

    // Normalize whitespace and lowercase
    return rawText
        .replace(/\s+/g, ' ') // Collapse all whitespace
        .trim()               // Trim start/end
        .toLowerCase();       // Normalize casing
}
