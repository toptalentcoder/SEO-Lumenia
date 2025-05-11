import axios from "axios";
import { SERPER_API_KEY } from "@/config/apiConfig";

export async function fetchSerpResults(keyword : string, gl : string, hl : string) {
    const response = await axios.post(
        "https://google.serper.dev/search",
        {
            q: keyword,
            gl: gl,
            num: 20,
            hl: hl
        },
        {
            headers: {
                "X-API-KEY": SERPER_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
  
    return response.data.organic || [];
}