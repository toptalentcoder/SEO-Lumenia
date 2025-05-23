'use client'

import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { AbilityContext } from '@/context/AbilityProvider'
import type { User } from '@/types/user'

const badgeColor = (planName: string) => {
    switch (planName) {
        case 'Lite Plan': return 'bg-green-100 text-green-800';
        case 'Lite Plan Plus': return 'bg-yellow-100 text-yellow-800';
        case 'Essential Plan': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function UserList() {
    const ability = useContext(AbilityContext)

    const { data, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
        },
    })

    if (!ability.can('read', 'User')) return <p>Access denied</p>
    if (isLoading) return <p>Loading...</p>

    return (
        <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
            <tr className="text-left">
                <th className="px-4 py-2 font-semibold">Avatar</th>
                <th className="px-4 py-2 font-semibold">Username</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Role</th>
                <th className="px-4 py-2 font-semibold">Subscription</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {data?.docs?.map((user) => (
                <tr key={user.id}>
                <td className="px-4 py-2">
                    <img
                    src={user.profileImageURL || '/avatar-placeholder.png'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    />
                </td>
                <td className="px-4 py-2">{user.username || '—'}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                    {user.subscriptionPlan?.plan_name ? (
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${badgeColor(user.subscriptionPlan.plan_name)}`}>
                        {user.subscriptionPlan.plan_name}
                    </span>
                    ) : (
                    <span className="text-gray-400 text-xs">None</span>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )
}
