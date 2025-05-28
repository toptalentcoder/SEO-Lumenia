import { SERPER_EMAIL, SERPER_PASSWORD } from "@/config/apiConfig"

export const serperApiMetrics = async () : Promise<Response> => {
    const loginRes = await fetch('https://api.serper.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: SERPER_EMAIL,
            password: SERPER_PASSWORD,
        }),
        redirect: 'manual',
    })

    if (!loginRes.ok) return new Response(
        JSON.stringify({ error: 'Failed to fetch SERPER.DEV API data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    )

const loginData = await loginRes.json()

    const setCookie = loginRes.headers.get('set-cookie')
    if (!setCookie || !loginRes.ok) {
        return new Response(
            JSON.stringify({ error: 'Failed to log in to Serper.dev' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
    }

    const cookies = setCookie
        .split(',')
        .map((c) => c.split(';')[0])
        .filter((c) => /connect\.sid|__cf_bm/.test(c))
        .join('; ')

    if (!cookies) {
        return new Response(
            JSON.stringify({ error: 'No session cookie found on Serper.dev' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
    }


    const statsRes = await fetch('https://api.serper.dev/stats/dashboard', {
        headers: {
            'Cookie': cookies,
        },
    })

    if (!statsRes.ok) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch dashboard data' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }

    const stats = await statsRes.json()

    return new Response(
        JSON.stringify({
            email: loginData.email,
            firstName: loginData.firstName,
            lastName: loginData.lastName,
            today: stats.usageToday,
            lastMonth: stats.usageLastMonth,
            balance: stats.creditBalance,
        }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}