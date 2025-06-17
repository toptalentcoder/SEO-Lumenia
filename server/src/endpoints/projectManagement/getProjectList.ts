import { FRONTEND_URL } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

interface ProjectSummary {
    projectName: string;
    projectID: string;
}

export const getUserProjectList: Endpoint = {
    path: "/getProjectList",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const email = req.query.email;

        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        try {
            // First get the user
            const user = await payload.find({
                collection: 'users',
                where: {
                    email: {
                        equals: email,
                    },
                },
            });

            if (!user.docs.length) {
                return new Response(
                    JSON.stringify({ error: 'User not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Then get all projects for this user
            const projects = await payload.find({
                collection: 'projects',
                where: {
                    user: {
                        equals: user.docs[0].id,
                    },
                },
                sort: '-createdAt',
            });

            return new Response(
                JSON.stringify(projects.docs),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            console.error('Error fetching projects:', error);
            return new Response(
                JSON.stringify({ error: 'Failed to fetch projects' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }),
};
