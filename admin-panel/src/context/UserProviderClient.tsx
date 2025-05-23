'use client'

import { useEffect, useState } from 'react'
import { UserProvider } from './UserContext'

export function UserProviderClient({
    user,
    children,
}: {
    user: any
    children: React.ReactNode
}) {
    // Optionally sync with localStorage
    useEffect(() => {
        if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('authToken', user.token || '')
        }
    }, [user])

    return <UserProvider>{children}</UserProvider>
}
