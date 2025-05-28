'use client'

import { useQuery } from '@tanstack/react-query'

export default function AzureCard() {
    const { data, isLoading } = useQuery({
        queryKey: ['azure-usage'],
        queryFn: async () => {
            const res = await fetch('/api/azure')
            if (!res.ok) throw new Error('Failed to load Azure usage')
            return res.json()
        },
    })

    if (isLoading) return <div className="bg-white p-4 rounded shadow">Loading Azure...</div>

    const percentUsed = ((parseFloat(data.usedCredit) / parseFloat(data.totalCredit)) * 100).toFixed(1)

    return (
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Azure OpenAI Usage</p>
            <h2 className="text-xl font-bold">{data.usedCredit} / {data.totalCredit}</h2>
            <p className="text-sm text-gray-500">Remaining: {data.remainingCredit}</p>
            <p className="text-sm text-gray-500">Email: {data.email}</p>
            <p className="text-sm text-gray-500">Company: {data.company}</p>
            <p className="text-sm text-gray-500">Status: {data.statusText}</p>
            <p className="text-sm text-gray-500">Subs: {data.activeSubscriptions}</p>
            <p className="text-sm text-gray-500">From {data.usageStartDate} to {data.usageEndDate}</p>
            <p className="text-xs text-gray-400 mt-1">{data.usageNote}</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                    className="bg-blue-600 h-2 rounded"
                    style={{
                        width: `${percentUsed}%`,
                    }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentUsed}% used</p>
        </div>
    )
}
