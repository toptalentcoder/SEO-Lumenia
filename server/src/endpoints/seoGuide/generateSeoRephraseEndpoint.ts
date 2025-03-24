
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { rephraseText } from "@/service/createSeoEditor/generateSeoRephrase";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoRephraseEndpoint: Endpoint = {
    path: "/generate_seo_rephrase",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await req.json();
        const { currentText } = body;

        if (!currentText) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid currentText" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        try {
            const rephrasedText = await rephraseText(currentText);
            return new Response(
                JSON.stringify({ success: true, rephrasedText }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("❌ Error rephrasing text:", error);
            return new Response(
                JSON.stringify({ error: "Failed to rephrase content" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }),
};
