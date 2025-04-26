import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface Project {
    seoGuides?: Array<{
        queryID: string;
    }>;
}

export const deleteQueryEndpoint: Endpoint = {
    path: "/deleteQuery",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const body = req.json ? await req.json() : {};
        const { email, queryID } = body;

        if (!email || !queryID) {
            return new Response(
                JSON.stringify({ 
                    success: false,
                    error: "Missing required fields",
                    details: {
                        email: !email ? "Email is required" : null,
                        queryID: !queryID ? "Query ID is required" : null
                    }
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ 
                    success: false,
                    error: "User not found",
                    details: { email }
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = users.docs[0];
        let queryFound = false;

        if (!Array.isArray(user.projects)) {
            return new Response(
                JSON.stringify({ 
                    success: false,
                    error: "Invalid user projects data",
                    details: { email }
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const updatedProjects = user.projects.map((project: unknown) => {
            if (!project || typeof project !== 'object') return project;

            const filteredGuides = ((project as Project).seoGuides || []).filter((guide) => {
                if (guide.queryID === queryID) {
                    queryFound = true;
                    return false;
                }
                return true;
            });

            return {
                ...project,
                seoGuides: filteredGuides
            };
        });

        if (!queryFound) {
            return new Response(
                JSON.stringify({ 
                    success: false,
                    error: "Query not found",
                    details: { queryID }
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        try {
            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(
                JSON.stringify({ 
                    success: true,
                    message: "Query deleted successfully"
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("Error updating user:", error);
            return new Response(
                JSON.stringify({ 
                    success: false,
                    error: "Failed to update user data",
                    details: error instanceof Error ? error.message : "Unknown error"
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }),
}; 