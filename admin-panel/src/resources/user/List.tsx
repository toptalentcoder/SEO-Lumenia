'use client'

import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { AbilityContext } from '@/lib/AbilityProvider'
import { userApi } from './useApi'
import type { User } from '@/types/user'

export default function UserList() {
  const ability = useContext(AbilityContext)

  const { data, isLoading } = useQuery<{ docs: User[] }>({
    queryKey: ['users'],
    queryFn: userApi.list,
  })

  if (!ability.can('read', 'User')) return <p>Access denied</p>
  if (isLoading) return <p>Loading...</p>

  return (
    <ul>
      {data?.docs?.map((item) => (
        <li key={item.id}>
          <strong>{item.email}</strong> – {item.role}
        </li>
      ))}
    </ul>
  )
}
