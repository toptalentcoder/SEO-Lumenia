import { SEMRUSH_API_KEY } from '@/config/apiConfig'
import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(`http://www.semrush.com/users/countapiunits.html?key=${SEMRUSH_API_KEY}`)

    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch SEMrush data' }, { status: 500 })

    const text = await res.text()
    const remainingUnits = parseInt(text.trim(), 10)

    // Assume plan has 2 million units/month (adjust as needed)
    const maxUnits = 2_000_000
    const usedUnits = maxUnits - remainingUnits
    const percentUsed = Math.min((usedUnits / maxUnits) * 100, 100)

    return NextResponse.json({
        remaining: remainingUnits,
        used: usedUnits,
        percentUsed: percentUsed.toFixed(1),
    })
}
