'use client'

import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { AbilityContext } from '@/lib/AbilityProvider'
import { subscriptionApi } from './useApi'
import type { Subscription } from '@/types/subscription'

export default function SubscriptionList() {
  const ability = useContext(AbilityContext)

  const { data, isLoading } = useQuery<Subscription[]>({
    queryKey: ['subscription'],
    queryFn: subscriptionApi.list,
  })

  if (!ability.can('read', 'Subscription')) return <p>Access denied</p>
  if (isLoading) return <p>Loading...</p>

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.id}</li>
      ))}
    </ul>
  )
}
