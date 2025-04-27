export async function fetchNumberOfBacklinks(domain: string) {
    const apiKey = process.env.SEMRUSH_API_KEY;
    const encodedDomain = encodeURIComponent(domain);

    const url = `https://api.semrush.com/analytics/v1/?key=${apiKey}&type=backlinks_overview&target=${encodedDomain}&target_type=url&export_columns=domains_num,urls_num`;

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

