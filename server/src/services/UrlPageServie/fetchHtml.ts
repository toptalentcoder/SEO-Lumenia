import axios from 'axios';

const TIMEOUT = 8000;

export async function fetchHTML(url: string): Promise<string | null> {
    try {
        const res = await axios.get(url, { timeout: TIMEOUT });
        return res.data;
    } catch {
        return null;
    }
}