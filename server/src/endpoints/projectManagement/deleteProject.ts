import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest, CollectionSlug } from "payload";
import { Project } from "./postProject";
import { FRONTEND_URL } from "@/config/apiConfig";

interface User {
    email: string;
    projects: Project[];
}

export const deleteProject: Endpoint = {
    path: "/delete-project",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        let email: string | undefined;
        let projectID: string | undefined;

        if (req.json) {
            const body = await req.json();
            email = body?.email;
            projectID = body?.projectID;
        }

        if (!email || !projectID) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                    },
                }
            );
        }

        const users = await payload.find({
            collection: "users" as CollectionSlug,
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                    },
                }
            );
        }

        const user = users.docs[0] as User;
        const existingProjects: Project[] = Array.isArray(user.projects) ? user.projects : [];

        // Find the project to delete
        const projectIndex = existingProjects.findIndex(project => project.projectID === projectID);
        if (projectIndex === -1) {
            return new Response(
                JSON.stringify({ error: "Project not found" }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                    },
                }
            );
        }

        // Remove the project
        existingProjects.splice(projectIndex, 1);

        // Update user's projects
        await payload.update({
            collection: "users" as CollectionSlug,
            where: { email: { equals: email } },
            data: { projects: existingProjects },
        });

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": FRONTEND_URL || "*",
                },
            }
        );
    }),
}; 