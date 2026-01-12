import { FetchClient } from '../lib/fetchClient'
import { api } from '../pages/services/api'
import {
	LoginRequest,
	LoginResponse,
	RefreshTokenResponse,
} from '../types/auth'

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`

export const authService = {
	login: async (data: LoginRequest): Promise<LoginResponse> => {
		const response = await api.post<LoginResponse>('/auth/login', data)
		return response.data
	},

	refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
		const client = new FetchClient({ baseURL: API_BASE_URL })
		const response = await client.post<RefreshTokenResponse>('/auth/refresh', {
			refreshToken,
		})
		return response.data
	},

	logout: async (refreshToken: string): Promise<void> => {
		await api.post('/auth/logout', { refreshToken })
	},
}
