import { withErrorHandling } from "@/middleware/errorMiddleware";
<<<<<<< HEAD
import { rephraseText } from "@/services/createSeoEditor/generateSeoRephrase";
=======
import { rephraseText } from "@/services/createSeoGuide/createSeoEditor/generateSeoRephrase";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoRephraseEndpoint: Endpoint = {
    path: '/generate_seo_rephrase',
    method: 'post',
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await req.json();
        const { currentText, language, queryID, email } = body;

        if (!currentText || typeof currentText !== "string") {
            return new Response(JSON.stringify({ error: "Missing or invalid currentText" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const rephrasedText = await rephraseText(currentText, language);

            return new Response(JSON.stringify({ success: true, rephrasedText }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("❌ generateSeoRephrase error:", error);
            return new Response(JSON.stringify({ error: "Failed to rephrase content" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    })
}; 