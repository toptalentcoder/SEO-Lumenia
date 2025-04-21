import { withErrorHandling } from "@/middleware/errorMiddleware";
import { autoExpandSeoText } from "@/services/createSeoEditor/generateSeoAuto";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoAutoEndpoint: Endpoint = {
    path: '/generate_seo_auto',
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
            const autoText = await autoExpandSeoText(currentText, language);

            return new Response(JSON.stringify({ success: true, autoText }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("❌ generateSeoAuto error:", error);
            return new Response(JSON.stringify({ error: "Failed to generate SEO auto content" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    })
}; 