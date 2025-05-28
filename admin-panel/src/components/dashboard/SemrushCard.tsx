'use client'

import { useQuery } from '@tanstack/react-query'

export default function SemrushCard() {
    const { data, isLoading } = useQuery({
        queryKey: ['semrush-usage'],
        queryFn: async () => {
            const res = await fetch('/api/semrush')
            if (!res.ok) throw new Error('Failed to load SEMrush usage')
            return res.json()
        },
    })

    if (isLoading) return <div className="bg-white p-4 rounded shadow">Loading SEMrush...</div>

    return (
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">SEMrush API Usage</p>
            <h2 className="text-xl font-bold">{data.used.toLocaleString()} / 2,000,000</h2>
            <p className="text-sm text-gray-500">Remaining: {data.remaining.toLocaleString()}</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                className="bg-red-500 h-2 rounded"
                style={{ width: `${data.percentUsed}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">{data.percentUsed}% used</p>
        </div>
    )
}
