'use client'

import { useRouter } from 'next/navigation'

export default function Sidebar() {
    const router = useRouter()

    return (
        <aside className="w-64 bg-white border-r min-h-screen p-4 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
            <button onClick={() => router.push('/dashboard')} className="text-left px-3 py-2 rounded hover:bg-gray-100">
            📊 Dashboard
            </button>
            <button onClick={() => router.push('/admin/user')} className="text-left px-3 py-2 rounded hover:bg-gray-100">
            👤 Users
            </button>
            <button onClick={() => router.push('/admin/billing_plan')} className="text-left px-3 py-2 rounded hover:bg-gray-100">
            💳 Plans
            </button>
        </nav>
        </aside>
    )
}
