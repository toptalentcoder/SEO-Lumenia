import { withErrorHandling } from "@/middleware/errorMiddleware";
import { generateSeoQuestions } from "@/services/createSeoEditor/generateSeoQuestionss";
import { ProjectSeoGuide } from "@/types/project";
import { Endpoint, PayloadRequest } from "payload";

export const generateSeoQuestionsEndpoint : Endpoint = {

    path : '/generate_seo_questions',

    method : 'post',

    handler : withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        const { payload } = req;

        if(!req.json){
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await req.json();
        const { query, keywords, language, queryID, email } = body;

        if (!query || typeof query !== "string" || !Array.isArray(keywords)) {
            return new Response(JSON.stringify({ error: "Missing or invalid query/keywords" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const questions = await generateSeoQuestions({ query, keywords, language });

            const users = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });

            if (!users.docs.length) {
                return new Response(
                    JSON.stringify({ error: `User not found for email: ${email}` }),
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

            const existingProjects: ProjectSeoGuide[] = Array.isArray(user.projects)
                ? (user.projects as ProjectSeoGuide[])
                : [];

            let projectUpdated = false;
            const updatedProjects = existingProjects.map((project) => {
                if (Array.isArray(project.seoGuides) ? project.seoGuides.some(guide => guide.queryID === queryID) : null) {
                    projectUpdated = true;
                    return {
                        ...project,
                        seoGuides: project.seoGuides.map(guide =>
                            guide.queryID === queryID
                                ? {
                                    ...guide,
                                    seoEditor: questions.join(' '), // Join questions into a single string
                                }
                                : guide
                        ),
                    };
                }
                return project;
            });

            if (!projectUpdated) {
                return new Response(
                    JSON.stringify({ error: "Project not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            await payload.update({
                collection: "users",
                where: { email: { equals: email } },
                data: { projects: updatedProjects },
            });

            return new Response(JSON.stringify({ success: true, questions }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
                console.error("❌ generateSeoQuestions error:", error);
                return new Response(JSON.stringify({ error: "Failed to generate SEO questions" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

    })
}