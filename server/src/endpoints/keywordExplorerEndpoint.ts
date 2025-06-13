import { FRONTEND_URL, SEMRUSH_API_KEY } from "@/config/apiConfig";
import { withErrorHandling } from "@/middleware/errorMiddleware";
import { classifyKeywordCategory } from "@/services/clssifyKeywordCategory";
import axios from "axios";
import { Endpoint, PayloadRequest } from "payload";

function estimateBidRange(cpc: number, competition: number) {
    const lowestBid = +(cpc * (1 - competition)).toFixed(2);
    const highestBid = +(cpc * (1 + competition)).toFixed(2);
    return { lowestBid, highestBid };
}

export const keywordExplorerEndpoint : Endpoint = {

    path : '/keyword-explorer',
    method : 'post',
    handler : withErrorHandling(async(req : PayloadRequest) : Promise<Response> => {
        const corsHeaders = {
            "Access-Control-Allow-Origin": FRONTEND_URL || "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const body = req.json ? await req.json() : {};
        const { phrase } = body;

        if (!phrase) {
            return new Response(JSON.stringify({ error: "Missing phrase" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        try {
            const url = `https://api.semrush.com/?type=phrase_related&key=${SEMRUSH_API_KEY}&phrase=${encodeURIComponent(
                phrase
            )}&database=us&export_columns=Ph,Nq,Cp,Co,Cr,Td`;

            const response = await axios.get(url);
            const lines = response.data.trim().split("\n");
            const rows = lines.slice(1, 51); // Limit to 50

            const enriched = await Promise.all(rows.map(async (line : string) => {
                const [keyword, searchVolume, cpcStr, competitionStr, trendStr] = line.split(";");

                const cpc = parseFloat(cpcStr || "0");
                const competition = parseFloat(competitionStr || "0");
                const trend = trendStr?.split(",").map(v => parseFloat(v.trim())) || [];

                const { lowestBid, highestBid } = estimateBidRange(cpc, competition);
                const category = await classifyKeywordCategory(keyword.trim());

                return {
                    keyword: keyword.trim(),
                    searchVolume,
                    cpc: cpc.toFixed(2),
                    competition: competition.toFixed(2),
                    trend,
                    lowestBid,
                    highestBid,
                    category,
                };
            }));

            return new Response(JSON.stringify(enriched), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        } catch (error: any) {
            return new Response(
                JSON.stringify({ err : "Failed to fetch from SEMrush" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }
    })
}