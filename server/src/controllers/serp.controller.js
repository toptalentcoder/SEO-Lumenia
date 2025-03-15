import { getJson } from 'serpapi';

export const googleSearchAPI = async (req, res) => {

    const { query } = req.body;

    const SERP_API_KEY = process.env.SERP_API_KEY;

    getJson({
        engine: "google",
        q: query,
        api_key: SERP_API_KEY,
    },
    (json) => {
        const response = json["organic_results"];

        const titleMap = new Map();

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

        res.json(extractedData);
    });
}
