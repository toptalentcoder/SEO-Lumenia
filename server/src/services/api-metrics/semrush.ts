import { SEMRUSH_API_KEY } from "@/config/apiConfig"

export const semrushApiMetrics = async () : Promise<Response> => {
    const res = await fetch(`http://www.semrush.com/users/countapiunits.html?key=${SEMRUSH_API_KEY}`)

    if (!res.ok) return new Response(
        JSON.stringify({ error: 'Failed to fetch SEMrush data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    )

    const text = await res.text()
    const remainingUnits = parseInt(text.trim(), 10)

    // Assume plan has 2 million units/month (adjust as needed)
    const maxUnits = 2_000_000
    const usedUnits = maxUnits - remainingUnits
    const percentUsed = Math.min((usedUnits / maxUnits) * 100, 100)

    return new Response(
        JSON.stringify({
            remaining: remainingUnits,
            used: usedUnits,
            percentUsed: percentUsed.toFixed(1),
        }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}