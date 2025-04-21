import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";

export const deleteQueryEndpoint: Endpoint = {
    path: "/delete_query",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;
        const body = req.json ? await req.json() : {};
        const { email, queryID } = body;

        if (!email || !queryID) {
            return new Response(
                JSON.stringify({ error: "Missing email or queryID" }),
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
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = users.docs[0];
        const updatedProjects = (Array.isArray(user.projects) ? user.projects : []).map((project) => {
            return typeof project === "object" && project !== null
                ? {
                    ...project,
                    seoGuides: ((project as { seoGuides?: { queryID: string }[] }).seoGuides || []).filter(
                        (guide) => guide.queryID !== queryID
                    ),
                }
                : project;
        });

        try {
            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(
                JSON.stringify({ success: true }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("Error updating user:", error);
            return new Response(
                JSON.stringify({ error: "Failed to update user data" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }),
}; 