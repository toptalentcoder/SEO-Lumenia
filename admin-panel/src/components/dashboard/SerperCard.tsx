'use client'

import { useQuery } from '@tanstack/react-query'

export default function SerperCard() {
    const { data, isLoading } = useQuery({
        queryKey: ['serper-usage'],
        queryFn: async () => {
        const res = await fetch('/api/serper')
        if (!res.ok) throw new Error('Failed to load Serper.dev usage')
        return res.json()
        },
    })

    if (isLoading) return <div className="bg-white p-4 rounded shadow">Loading Serper.dev...</div>

    return (
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Serper.dev Usage</p>
            <h2 className="text-xl font-bold">Usage today : {data.today.toLocaleString()}</h2>
            <p className="text-sm text-gray-500">Email: {data.email}</p>
            <p className="text-sm text-gray-500">Usage Last Month: {data.lastMonth.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Credit Balance: {data.balance.toLocaleString()} credits</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                    className="bg-indigo-500 h-2 rounded"
                    style={{
                        width: `${Math.min((data.today / 100000) * 100, 100)}%`,
                    }}
                />
            </div>
        </div>
    )
}
