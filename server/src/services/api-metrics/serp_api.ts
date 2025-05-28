import { SERP_API_KEY } from "@/config/apiConfig"

export const serpApiMetrics = async () : Promise<Response> => {
    const res = await fetch(`https://serpapi.com/account.json?api_key=${SERP_API_KEY}`)

    if (!res.ok) return new Response(
        JSON.stringify({ error: 'Failed to fetch SERP API data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    )

    const data = await res.json()

    return new Response(
        JSON.stringify({
            total_searches: data.searches_per_month,
            searches_left: data.total_searches_left,
            account_email: data.account_email,
            plan: data.plan_name,
        }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}