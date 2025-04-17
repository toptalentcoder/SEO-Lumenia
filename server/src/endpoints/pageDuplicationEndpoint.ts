import { pageDuplicationAnalysis } from '@/services/UrlPageServie/pageDuplicationAnalysis';
import { Endpoint, PayloadRequest } from 'payload';

export const pageDuplicationEndpoint: Endpoint = {
    path: '/page-duplication',
    method: 'post',
    handler: async (req : PayloadRequest) : Promise<Response> => {

        const { payload } = req;
        const body = req.json ? await req.json() : {};

        const { baseUrl } = body;

        if (!baseUrl) {
            return new Response(JSON.stringify({ error: "Missing baseUrl" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const result = await pageDuplicationAnalysis(baseUrl, payload);

        return new Response(
            JSON.stringify({ success: true, result }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    },
};
