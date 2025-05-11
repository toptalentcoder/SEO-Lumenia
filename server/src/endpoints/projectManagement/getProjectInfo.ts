import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

// Define the Project interface
interface Project {
    projectID : string;
    projectName: string;
    domainName: string;
    favourites?: string[]; // Favourites is optional, as it may not always be provided
}

export const getUserProjectInfo: Endpoint = {
    path: "/getProjectItemInfo",

    method: 'get',

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        };

        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
                    ...corsHeaders
                },
            });
        }

        const { email, projectID } = req.query;

        if (!email || !projectID) {
            return new Response(
                JSON.stringify({ error: "Both email and projectID are required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        // Fetch the user by email
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify(`❌ Error: User not found for email: ${email}`),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        // Extract the user's projects and ensure it's an array of Project
        const user = users.docs[0];

        // If projects exist, narrow down the type to Project[]
        let projects: Project[] = [];

        if (Array.isArray(user.projects)) {
            projects = user.projects as Project[]; // Type assertion to Project[] if it's an array
        } else {
            // Handle case where projects might not be an array or may be undefined
            return new Response(
                JSON.stringify({ error: "User projects are not available or not in the expected format" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        // Find the project that matches the provided projectName
        const matchingProject = projects.find((project) => project.projectID === projectID);

        if (!matchingProject) {
            return new Response(
                JSON.stringify({ error: `Project not found for projectID: ${projectID}` }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        // Respond with the processed data
        return new Response(
            JSON.stringify({
                matchingProject
            }),
            { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
    })
};
