import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoBrief } from "@/service/createSeoEditor/createSeoBrief";
import { Endpoint, PayloadRequest } from "payload";

export const createSeoBriefEndpoint : Endpoint = {

    path : '/createSeoBrief',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await req.json();
        const { query } = body;

        const seoBrief = await generateSeoBrief(query);

        return new Response(JSON.stringify({ success: true, seoBrief }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    })
}