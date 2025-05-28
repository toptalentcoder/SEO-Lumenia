// src/app/api/serper/route.ts
import { SERPER_EMAIL, SERPER_PASSWORD } from '@/config/apiConfig'
import { NextResponse } from 'next/server'

export async function GET() {
    const loginRes = await fetch('https://api.serper.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: SERPER_EMAIL,
            password: SERPER_PASSWORD,
        }),
        redirect: 'manual',
    })

    if (!loginRes.ok) {
        return NextResponse.json({ error: 'Serper.dev Login failed' }, { status: 401 })
    }

    const loginData = await loginRes.json()

    const setCookie = loginRes.headers.get('set-cookie')
    if (!setCookie || !loginRes.ok) {
        return NextResponse.json({ error: 'Failed to log in to Serper.dev' }, { status: 401 })
    }

    const cookies = setCookie
        .split(',')
        .map((c) => c.split(';')[0])
        .filter((c) => /connect\.sid|__cf_bm/.test(c))
        .join('; ')

    if (!cookies) {
        return NextResponse.json({ error: 'No session cookie found on Serper.dev' }, { status: 401 })
    }


    const statsRes = await fetch('https://api.serper.dev/stats/dashboard', {
        headers: {
            'Cookie': cookies,
        },
    })

    if (!statsRes.ok) {
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
    }

    const stats = await statsRes.json()

    return NextResponse.json({
        email: loginData.email,
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        today: stats.usageToday,
        lastMonth: stats.usageLastMonth,
        balance: stats.creditBalance,
    })
}
