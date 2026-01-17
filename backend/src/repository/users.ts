import type { User, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { ConflictError } from '../errors/index.js'

export type IUserRepository = {
	create(user: User): Promise<void>
	update(id: UUID, updates: Partial<Omit<User, 'id'>>): Promise<void>
	delete(id: UUID): Promise<void>
	findByEmail(email: string): Promise<User | null>
	findById(id: UUID): Promise<User | null>
}

class UserRepository extends BaseRepository<User> implements IUserRepository {
	constructor() {
		super('users')
	}

	async create(user: User): Promise<void> {
		if (await this.findByEmail(user.email))
			throw new ConflictError('Email already exists')

		await super.create(user)
	}

	async update(id: UUID, updates: Partial<Omit<User, 'id'>>): Promise<void> {
		try {
			await super.update(id, updates)
		} catch (err) {
			if (
				err instanceof Error &&
				err.message.includes(
					'duplicate key value violates unique constraint "users_email_unique"'
				)
			) {
				throw new ConflictError('Email already exists')
			}

			throw err
		}
	}

	async delete(id: UUID): Promise<void> {
		await super.delete(id)
	}

	async findByEmail(email: string): Promise<User | null> {
		const row = await this.db('users').where({ email }).first<User>()

		if (!row) return null

		return row
	}

	async findById(id: UUID): Promise<User | null> {
		const row = await this.db('users').where({ id }).first<User>()

		if (!row) return null

		return row
	}
}

export const userRepository = new UserRepository()
