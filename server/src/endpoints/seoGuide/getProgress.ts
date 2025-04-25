import { Endpoint, PayloadRequest } from 'payload';
import { withErrorHandling } from '@/middleware/errorMiddleware';

export const getProgressEndpoint: Endpoint = {
    path: '/get-progress',
    method: 'post',
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const body = req.json ? await req.json() : {};
        const { email, projectID } = body;

        if (!email || !projectID) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { payload } = req;

        // Find the user and their project
        const users = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const user = users.docs[0];
        const project = Array.isArray(user.projects) 
            ? user.projects.find((p: any) => p.projectID === projectID)
            : undefined;

        if (!project) {
            return new Response(
                JSON.stringify({ error: 'Project not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Return the progress from the project
        return new Response(
            JSON.stringify({
                progress: (project as any).progress || 0,
                status: (project as any).status || 'pending',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }),
}; 