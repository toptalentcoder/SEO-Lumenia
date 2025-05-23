import { createApi } from '@/lib/apiClient'

// ⚠️ Note the plural slug
export const userApi = createApi('/users')
