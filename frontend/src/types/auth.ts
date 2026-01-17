import type { UUID } from './index.js'

export type AuthUser = {
	id: UUID
	firstName: string
	lastName: string
	email: string
	userType: string
	userTypeName: string
	permissions: {
		approveMeasurement: boolean
	}
}

export type LoginRequest = {
	email: string
	password: string
}

export type LoginResponse = {
	accessToken: string
	refreshToken: string
	user: AuthUser
}

export type RefreshTokenRequest = {
	refreshToken: string
}

export type RefreshTokenResponse = {
	accessToken: string
}

export type LogoutRequest = {
	refreshToken: string
}

export type AuthContextType = {
	user: AuthUser | null
	accessToken: string | null
	refreshToken: string | null
	isLoading: boolean
	isAuthenticated: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	refreshAccessToken: () => Promise<void>
}
