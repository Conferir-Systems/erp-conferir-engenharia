import { BaseRepository } from './BaseRepository.js'
import type { RefreshToken, UUID } from '../types/index.js'

export type IRefreshTokenRepository = {
	create(token: RefreshToken): Promise<void>
	findByToken(token: string): Promise<RefreshToken | null>
	revokeToken(token: string): Promise<void>
	revokeAllUserTokens(userId: UUID): Promise<void>
	deleteExpiredTokens(): Promise<void>
}

class RefreshTokenRepository
	extends BaseRepository<RefreshToken>
	implements IRefreshTokenRepository
{
	constructor() {
		super('refresh_tokens')
	}

	async findByToken(token: string): Promise<RefreshToken | null> {
		const row = await this.db(this.tableName)
			.where({ token })
			.whereNull('revokedAt')
			.where('expiresAt', '>', new Date())
			.first()

		return row ? row : null
	}

	async revokeToken(token: string): Promise<void> {
		await this.db(this.tableName)
			.where({ token })
			.update({ revokedAt: new Date() })
	}

	async revokeAllUserTokens(userId: UUID): Promise<void> {
		await this.db(this.tableName)
			.where({ userId })
			.update({ revokedAt: new Date() })
	}

	async deleteExpiredTokens(): Promise<void> {
		await this.db(this.tableName).where('expiresAt', '<', new Date()).delete()
	}
}

export const refreshTokenRepository = new RefreshTokenRepository()
