'use client'

import React from 'react'
import { createContext, useMemo } from 'react'
import { defineAbilitiesFor } from './rbac'

export const AbilityContext = createContext<any>(null)

export const AbilityProvider = ({ role, children }: { role: string; children: React.ReactNode }) => {
  const ability = useMemo(() => defineAbilitiesFor(role), [role])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}
