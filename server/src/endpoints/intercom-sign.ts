import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint } from "payload";
import crypto from 'crypto';
export const intercomSign : Endpoint = {

    path : '/intercom-sign',

    method : 'post',

    handler : withErrorHandling(async (req) : Promise<Response> => {
        if (!req.json) {
            return new Response('Invalid request', { status: 400 });
        }

        const { email } = await req.json();

        const { intercomID, intercomSecretKey } = await req.payload.findGlobal({
            slug: 'intercom-settings'
        });

        if (!intercomID || !intercomSecretKey) {
            return new Response('Intercom settings not found', { status: 404 });
        }

        const hmac = crypto.createHmac('sha256', intercomSecretKey);
        hmac.update(email);
        const userHash = hmac.digest('hex');

        return new Response(JSON.stringify({
            intercomID,
            userHash
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    })
    
}