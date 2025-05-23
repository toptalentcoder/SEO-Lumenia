'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import Image from 'next/image'

export default function Topbar() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <header className="w-full bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => router.push('/dashboard')}>
        🔷 Lumenia
      </div>

      {/* Navigation */}
      <nav className="flex gap-6">
        <button onClick={() => router.push('/dashboard')} className="text-sm font-medium text-gray-700 hover:text-blue-600">
          📊 Dashboard
        </button>
        <button onClick={() => router.push('/admin/user')} className="text-sm font-medium text-gray-700 hover:text-blue-600">
          👤 Users
        </button>
        <button onClick={() => router.push('/admin/billing_plan')} className="text-sm font-medium text-gray-700 hover:text-blue-600">
          💳 Plans
        </button>
      </nav>

      {/* Profile */}
      <div className="flex items-center gap-3">

        <Image
          src={user?.profileImageURL || '/avatar-placeholder.png'}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-800">
          {user?.username || user?.email || 'Guest'}
        </span>
      </div>
    </header>
  )
}
