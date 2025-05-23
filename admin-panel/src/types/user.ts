export type User = {
    id: string
    email: string
    username?: string
    role: 'admin' | 'user'
    profilePicture?: string
    profileImageURL?: string
    subscriptionPlan?: {
        value: 'Lite Plan' | 'Lite Plan Plus' | 'Essential Plan' | 'Enterprise Plan' | 'Agency Plan' | string
        relationTo: string
        plan_name?: string;
    }
    apiPlan?: string
    availableFeatures?: {
        tokens?: number
        ai_tokens?: number
        seats?: number
        guests?: number
        monitoring?: number
    }
    projects?: any
}