import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const saveTestData: Endpoint = {
    path: "/test",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const startTime = performance.now();
        
        // Create test data with proper structure - using numbers instead of strings
        const dataList = Array.from({ length: 1000 }, (_, i) => ({
            aaaaa: i
        }));
        
        let successCount = 0;
        let failCount = 0;
  
        try {
            // Process in batches of 100
            for (let i = 0; i < dataList.length; i += 100) {
                const batchData = dataList.slice(i, i + 100);
                console.log(`Processing batch ${i/100 + 1} of ${Math.ceil(dataList.length/100)}`);
  
                // Create documents one by one to ensure proper validation
                for (const entry of batchData) {
                    try {
                        await req.payload.create({
                            collection: "test",
                            data: entry
                        });
                        successCount++;
                    } catch (error: any) {
                        failCount++;
                        console.error(
                            `Error inserting record:`,
                            error?.message || 'Unknown error'
                        );
                    }
                }
            }

            const endTime = performance.now();
            const totalTime = endTime - startTime;
      
            return new Response(
                JSON.stringify({ 
                    message: "done",
                    totalTime: `${totalTime.toFixed(2)}ms`,
                    successCount,
                    failCount
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (error: any) {
            console.error('Batch processing error:', error);
            return new Response(
                JSON.stringify({ 
                    message: "error",
                    error: error?.message || 'Unknown error occurred'
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }),
};
  
