import { SEMRUSH_API_KEY } from "@/config/apiConfig"

export const semrushApiMetrics = async () => {
    const res = await fetch(`http://www.semrush.com/users/countapiunits.html?key=${SEMRUSH_API_KEY}`)

    if (!res.ok) 
        throw new Error('Failed to fetch SEMrush data');

    const text = await res.text()

    const remainingUnits = parseInt(text.trim(), 10)

    // Assume plan has 2 million units/month (adjust as needed)
    const maxUnits = 2_000_000
    const usedUnits = maxUnits - remainingUnits

    const percentUsed = Math.min((usedUnits / maxUnits) * 100, 100)

    return {
        remaining: remainingUnits,
        used: usedUnits,
        percentUsed: percentUsed.toFixed(1),
    }
}