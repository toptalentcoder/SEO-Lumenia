import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export interface Project {
    projectID : string;
    projectName: string;
    domainName: string;
    createdAt? : Date;
}

export const addProjectToUser: Endpoint = {
    path: "/post-project",

    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;

        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        let projectName: string | undefined;
        let domainName: string | undefined;
        let email: string | undefined;
        let projectID : string | undefined;

        if(req.json){
            const body = await req.json();
            email = body?.email;
            projectName = body?.projectName;
            domainName = body?.domainName;
            projectID = body?.projectID;
        }

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        if(!projectName || !domainName || !projectID){
            return new Response(
                JSON.stringify({ error: "Missing projectName, domainName, projectID." }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

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
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const user = users.docs[0];

        // ✅ Ensure `projects` is an array
        const existingProjects: Project[] = Array.isArray(user.projects) ? (user.projects as Project[]) : [];

        // ✅ Check if project already exists
        const projectExists = existingProjects.some(project => project.projectName === projectName);
        if (projectExists) {
            return new Response(
                JSON.stringify({ message: "Project already exists" }),
                { status: 409 }
            );
        }

        // ✅ Define new project correctly
        const newProject: Project = { projectID, projectName, domainName, createdAt: new Date() };

        // ✅ Update project list
        const updatedProjects: Project[] = [...existingProjects, newProject];

        await payload.update({
            collection: "users",
            where: { email: { equals: email } },
            data: { projects: updatedProjects },
        });

        return new Response(JSON.stringify({ message: "Project added successfully" }), { status: 201 });
    }),
};
