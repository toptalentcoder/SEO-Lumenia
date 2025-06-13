import { withErrorHandling } from "@/middleware/errorMiddleware";
import { fetchSemrushKeywords } from "@/services/fetchNumberOf25TopKeywords";
import { Endpoint } from "payload";

export const getNumberOf25TopKeywordsEndpoint : Endpoint = {

    path : '/getNumberOf25TopKeywords',

    method : 'get',

    handler : withErrorHandling(async (req) : Promise<Response> => {

        const url = req.query.url as string;

        if (!url) {
            return new Response(JSON.stringify({ error: 'Missing URL parameter.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const { top25Count, firstThreeKeywords } = await fetchSemrushKeywords(url);

        return new Response(JSON.stringify({
            numberOf25TopKeywords: top25Count,
            firstThreeKeywords
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    })
}