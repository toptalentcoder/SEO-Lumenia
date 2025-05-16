import { withErrorHandling } from "@/middleware/errorMiddleware";
import { translateText } from "@/services/createSeoGuide/createSeoEditor/translateSeoText";
import { Endpoint, PayloadRequest } from "payload";

export const translateSeoEditorEndpoint: Endpoint = {
    path: "/translate_seo_editor_text",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (!req.json) {
            return new Response(JSON.stringify({ error: "Missing JSON" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const body = await req.json();
        const { currentText, language, queryID, email } = body;

        if (!currentText || !language) {
            return new Response(JSON.stringify({ error: "Missing content or language" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const translatedText = await translateText(currentText, language);

        // Optionally save to DB (if you want)
        // You can mirror how other endpoints update seoEditor field

        return new Response(
            JSON.stringify({ success: true, translatedText }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
};
