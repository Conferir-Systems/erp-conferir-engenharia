import axios from 'axios'
import { ConstructionSite } from '../types'

const API_BASE_URL = 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export const worksApi = {
  getAll: async (): Promise<ConstructionSite[]> => {
    const response = await api.get<ConstructionSite[]>('/works')
    return response.data
  },

  getById: async (id: string): Promise<ConstructionSite> => {
    const response = await api.get<ConstructionSite>(`/works/${id}`)
    return response.data
  },

  create: async (
    data: Omit<ConstructionSite, 'id' | 'createdAt' | 'updatedAt' | 'code'>
  ): Promise<ConstructionSite> => {
    const response = await api.post<ConstructionSite>('/works', data)
    return response.data
  },

  update: async (
    id: string,
    data: Partial<Omit<ConstructionSite, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ConstructionSite> => {
    const response = await api.put<ConstructionSite>(`/works/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/works/${id}`)
  },
}
