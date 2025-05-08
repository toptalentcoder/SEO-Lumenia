import axios from "axios";

export async function fetchSerpResults(keyword : string, location : string) {
    const response = await axios.post(
        "https://google.serper.dev/search",
        {
            q: keyword,
            location: location,
            num: 20,
        },
        {
            headers: {
                "X-API-KEY": process.env.SERPER_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
  
    return response.data.organic || [];
}