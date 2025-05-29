import { semrushApiMetrics } from "@/services/api-metrics/semrush";
import { Endpoint } from "payload";

export const testEndpoint: Endpoint = {
    path: '/test',
    method: 'get',
    handler: async (): Promise<Response> => {


        const result = await semrushApiMetrics();

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
