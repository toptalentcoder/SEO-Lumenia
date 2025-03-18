type ErrorDetails = {
    message: string;
    context: string;
    type: string;
    causes: string[];
    timestamp: string;
    stack?: string;
    };

type ErrorStatus = {
    status: number;
    causes: string[];
};

export class ErrorHandler {

    /**
     * Handles an error and returns structured JSON error details.
     * @param error The error object to handle.
     * @param context A description of where the error occurred.
     * @returns An object containing error details.
     */

    static handle(error: unknown, context: string = "Unknown"): { errorDetails: ErrorDetails; status: number } {

        const { status, causes } = this.determineStatusAndCauses(error);

        const errorDetails: ErrorDetails = {
            message: "An error occurred.",
            context,
            type: error instanceof Error ? error.name : "UnknownError",
            causes,
            timestamp: new Date().toISOString(),
            stack: error instanceof Error ? error.stack : undefined,
        };

        console.error("Error:", JSON.stringify(errorDetails, null, 2));

        return { errorDetails, status };
    }

    /**
     * Determines the HTTP status and potential causes based on the error.
     * @param error The error object.
     * @returns An object containing the status code and possible causes.
     */

    private static determineStatusAndCauses(error: unknown): ErrorStatus {

        const defaultStatus = 500;
        const defaultCauses = ["An unknown error occurred."];

        if (!(error instanceof Error)) {
            return { status: defaultStatus, causes: defaultCauses };
        }

        if (error.message.includes("Invalid data")) {
            return {
            status: 400,
            causes: ["The data may be malformed or incomplete.", "Verify the data format."],
            };
        }
        if (error.message.includes("NetworkError")) {
            return {
            status: 503,
            causes: ["Network issues or API downtime.", "Check your internet connection or API availability."],
            };
        }
        if (error.message.includes("AuthorizationError")) {
            return {
            status: 401,
            causes: ["Authentication failed.", "Verify credentials or access tokens."],
            };
        }
        if (error.message.includes("NotFoundError")) {
            return {
            status: 404,
            causes: ["The requested resource could not be found.", "Check the resource URL or identifier."],
            };
        }
        if (error.message.includes("PayloadError")) {
            return {
            status: 422,
            causes: ["Issues with Payload CMS.", "Verify collection schemas and API endpoints."],
            };
        }
        if (error.stack?.includes("SyntaxError")) {
            return {
            status: 500,
            causes: ["Unexpected response format (e.g., invalid JSON).", "Check the API response structure."],
            };
        }

        return { status: defaultStatus, causes: defaultCauses };
    }
}
