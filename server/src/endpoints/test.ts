import { withErrorHandling } from "@/middleware/errorMiddleware";
import { getAzureOPenAIUsage } from "@/services/api-metrics/azure_open_ai";
import { Endpoint } from "payload";

export const testEndpoint: Endpoint = {
    path: '/test',
    method: 'get',
    handler: async (): Promise<Response> => {


        const result = await getAzureOPenAIUsage();

        console.log('Result from getAzureOPenAIUsage:', result);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
