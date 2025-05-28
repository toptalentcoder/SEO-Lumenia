'use client'

import { useQuery } from '@tanstack/react-query'

export default function SerpApiCard() {
    const { data, isLoading } = useQuery({
        queryKey: ['serpapi-usage'],
        queryFn: async () => {
            const res = await fetch('/api/serpapi')
            if (!res.ok) throw new Error('Failed to load SerpApi usage')
            return res.json()
        },
    })

    if (isLoading) return <div className="bg-white p-4 rounded shadow">Loading...</div>

    const used = data.total_searches - data.searches_left
    const percentUsed = ((used / data.total_searches) * 100).toFixed(1)

    return (
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">SerpApi Usage</p>
            <h2 className="text-xl font-bold">{used}/{data.total_searches}</h2>
            <p className="text-sm text-gray-500 mt-1">Plan: {data.plan}</p>
            <p className="text-sm text-gray-500">Email: {data.account_email}</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${percentUsed}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentUsed}% used</p>
        </div>
    )
}
