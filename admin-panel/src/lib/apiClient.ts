// // src/lib/apiClient.ts
// import axios from 'axios'

// export const apiClient = axios.create({
//     baseURL: 'http://167.235.246.98:7778/api/',
// })

// export function createApi(path: string) {
//     return {
//         list: () => apiClient.get(path).then(res => res.data),
//         get: (id: string) => apiClient.get(`${path}/${id}`).then(res => res.data),
//         create: (data: any) => apiClient.post(path, data).then(res => res.data),
//         update: (id: string, data: any) => apiClient.put(`${path}/${id}`, data).then(res => res.data),
//         delete: (id: string) => apiClient.delete(`${path}/${id}`).then(res => res.data),
//     }
// }
