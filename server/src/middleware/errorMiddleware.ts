/**
 * Middleware to handle errors for API handlers.
 * @param handler The API handler function.
 * @returns A wrapped function with error handling.
 */
import { ErrorHandler } from "@/handlers/errorHandler";
import { PayloadRequest } from "payload";

export const withErrorHandling = (
    handler : ( req: PayloadRequest) => Promise<Response>
) : ( (req: PayloadRequest) => Promise<Response> ) => {
        return async (req: PayloadRequest): Promise<Response> => {
            try {
                // Execute the original handler
                return await handler(req);
            } catch (error) {
                // Handle the error and return a standardized response
                const { errorDetails, status } = ErrorHandler.handle(error, "API Request Error");
                return new Response(JSON.stringify(errorDetails), {
                    status,
                    headers: { "Content-Type": "application/json" },
                });
            }
        };
    };