import { withErrorHandling } from "@/middleware/errorMiddleware";
import { fetchNumberOfBacklinks } from "@/services/fetchNumberOfBacklinks";
import { Endpoint } from "payload";

export const getNumberOfBacklinksEndpoint : Endpoint = {
    path: '/getNumberOfBacklinks',
    method: 'get',
    handler: withErrorHandling(async (req): Promise<Response> => {
        const url = req.query.url as string;

        if (!url) {
            return new Response(JSON.stringify({ error: 'Missing URL parameter.' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        const { hostBakclinks, UrlBacklinks } = await fetchNumberOfBacklinks(url);

        return new Response(JSON.stringify({ 
            hostBacklinks: hostBakclinks,
            urlBacklinks: UrlBacklinks
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });
    })
}
