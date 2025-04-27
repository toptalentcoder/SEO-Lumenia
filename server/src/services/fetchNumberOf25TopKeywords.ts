export async function fetchSemrushKeywords(domain: string) {

    const apiKey = process.env.SEMRUSH_API_KEY;
    // Ensure domain has trailing slash before encoding
    const domainWithSlash = domain.endsWith('/') ? domain : `${domain}/`;
    const encodedDomain = encodeURIComponent(domainWithSlash);
  
    const url = `https://api.semrush.com/analytics/?key=${apiKey}&type=url_organic&url=${encodedDomain}&database=us&display_sort=po_asc&display_limit=100&export_columns=Ph,Po`;
  
    const response = await fetch(url);
    const text = await response.text();
  
    // Parse CSV response
    const lines = text.trim().split('\n');
    const data = lines.slice(1).map(line => {
      const [Ph, Po] = line.split(';');
      return { keyword: Ph, position: Number(Po) };
    });
  
    // Filter top 25 keywords
    const top25Keywords = data.filter(item => item.position <= 25);
  
    // Get first three keywords
    const firstThreeKeywords = data.slice(0, 3).map(item => item.keyword);
  
    return {
      top25Count: top25Keywords.length,
      firstThreeKeywords
    };
  }