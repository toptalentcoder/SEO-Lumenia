import { SEMRUSH_API_KEY } from "@/config/apiConfig";

export async function fetchNumberOfBacklinks(domain: string) {

    // Ensure domain has trailing slash before encoding
    const domainWithSlash = domain.endsWith('/') ? domain : `${domain}/`;
    const encodedDomain = encodeURIComponent(domainWithSlash);

    const url = `https://api.semrush.com/analytics/v1/?key=${SEMRUSH_API_KEY}&type=backlinks_overview&target=${encodedDomain}&target_type=url&export_columns=domains_num,urls_num`;

    const response = await fetch(url);
    const text = await response.text();

    // Parse CSV response
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('Invalid response from SEMrush API');
    }

    const [domains_num, urls_num] = lines[1].split(';').map(num => parseInt(num, 10));

    return {
        hostBakclinks: domains_num,
        UrlBacklinks: urls_num
    };
}

