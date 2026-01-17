import type { UUID } from './common.js'

export type JwtPayload = {
	userId: UUID
	email: string
	userType: string
	userTypeName: string
	permissions: {
		approveMeasurement: boolean
	}
}

export type RefreshToken = {
	id: UUID
	userId: UUID
	token: string
	expiresAt: Date
	createdAt: Date
	revokedAt: Date | null
}

export type RefreshTokenDatabaseRow = {
	id: UUID
	user_id: UUID
	token: string
	expires_at: Date
	created_at: Date
	revoked_at: Date | null
}

export type LoginRequest = {
	email: string
	password: string
}

export type LoginResponse = {
	accessToken: string
	refreshToken: string
	user: {
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
}

export type RefreshTokenRequest = {
	refreshToken: string
}

export type RefreshTokenResponse = {
	accessToken: string
}
