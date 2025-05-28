// src/app/api/serpapi/route.ts
import { SERPAPI_KEY } from '@/config/apiConfig'
import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(`https://serpapi.com/account.json?api_key=${SERPAPI_KEY}`)

    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })

    const data = await res.json()

    return NextResponse.json({
        total_searches: data.searches_per_month,
        searches_left: data.total_searches_left,
        account_email: data.account_email,
        plan: data.plan_name,
    })
}
