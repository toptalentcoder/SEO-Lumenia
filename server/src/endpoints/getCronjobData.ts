import { PayloadRequest } from "payload";
import { Endpoint } from "payload";
<<<<<<< HEAD
=======
import { FRONTEND_URL } from "@/config/apiConfig";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

interface CronEntry {
    date: string;
    position: number;
}

interface SearchResult {
    title?: string;
    link: string;
    cronjob?: {
        [link: string]: CronEntry[];
    };
}

interface SeoGuide {
    queryID: string;
    query: string;
    searchResults: SearchResult[];
    cronjob?: {
        [link: string]: CronEntry[];
    };
}

export const getCronjobData: Endpoint = {
    path: "/getCronjobData",
    method: "get",
    handler: async (req: PayloadRequest): Promise<Response> => {
        try {
        const { payload } = req;

        // CORS headers
        const corsHeaders = {
<<<<<<< HEAD
            "Access-Control-Allow-Origin": "*",
=======
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, {
            status: 204,
            headers: { ...corsHeaders },
            });
        }

        const { email, url, queryID } = req.query;

        if (!email || !url || !queryID) {
            return new Response(
            JSON.stringify({ error: "Missing email, url, or queryID" }),
            {
                status: 400,
                headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
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
            JSON.stringify({ error: `User not found for email: ${email}` }),
            {
                status: 404,
                headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
                },
            }
            );
        }

        const user = users.docs[0];

        const allSeoGuides: SeoGuide[] = Array.isArray(user.projects)
            ? (user.projects as Array<{ seoGuides?: SeoGuide[] }>).flatMap(
                (project) => project.seoGuides || []
            )
            : [];

        const matchingGuide = allSeoGuides.find(
            (g) => g.queryID === queryID
        );

        if (!matchingGuide) {
            return new Response(
            JSON.stringify({ error: "SEO Guide not found for queryID" }),
            {
                status: 404,
                headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
                },
            }
            );
        }

        // Build the result for top 20 search results
        const resultData = matchingGuide.searchResults.slice(0, 20).map((result) => {
            const cronHistory = matchingGuide.cronjob?.[result.link] || [];
            const sorted = [...cronHistory].sort((a, b) =>
            a.date.localeCompare(b.date)
            );
            const latest = sorted.at(-1)?.position ?? null;
            const previous = sorted.at(-2)?.position ?? null;
            const delta =
            latest !== null && previous !== null ? previous - latest : 0;

            return {
            title: result.title || "",
            link: result.link,
            currentPosition: latest,
            change: delta,
            };
        }).sort((a, b) => {
            if (a.currentPosition === null) return 1;
            if (b.currentPosition === null) return -1;
            return a.currentPosition - b.currentPosition;
        });

        // Also return full cronjob history for the requested URL
        const cronEntries = matchingGuide.cronjob?.[url as string] || [];

        return new Response(
            JSON.stringify({
            data: resultData,
            cronjob: cronEntries,
            }),
            {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
            }
        );
        } catch (err) {
        console.error("❌ Failed to fetch cronjob data:", err);
        return new Response(
            JSON.stringify({
            error: "Server error while fetching cronjob data",
            }),
            {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
            }
        );
        }
    },
};
