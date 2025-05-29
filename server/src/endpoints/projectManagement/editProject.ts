import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest, CollectionSlug } from "payload";
import { Project } from "./postProject";
import { FRONTEND_URL } from "@/config/apiConfig";

interface User {
    email: string;
    projects: Project[];
}

export const editProject: Endpoint = {
    path: "/edit-project",
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

        let projectName: string | undefined;
        let domainName: string | undefined;
        let email: string | undefined;
        let projectID: string | undefined;

        if (req.json) {
            const body = await req.json();
            email = body?.email;
            projectName = body?.projectName;
            domainName = body?.domainName;
            projectID = body?.projectID;
        }

        if (!email || !projectID || !projectName || !domainName) {
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

        const user = users.docs[0] as unknown as User;
        const existingProjects: Project[] = Array.isArray(user.projects) ? user.projects : [];

        // Find the project to update
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

        // Update the project
        existingProjects[projectIndex] = {
            ...existingProjects[projectIndex],
            projectName,
            domainName,
        };

        await payload.update({
            collection: "users" as CollectionSlug,
            where: { email: { equals: email } },
            data: { projects: existingProjects },
        });

        return new Response(
            JSON.stringify({ 
                success: true, 
                project: existingProjects[projectIndex] 
            }),
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