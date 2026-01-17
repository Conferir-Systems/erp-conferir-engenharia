import { Knex } from 'knex'
import { db } from '../database/db.js'
import { NotFoundError } from '../errors/index.js'
import type { UUID } from '../types/index.js'

export abstract class BaseRepository<TDomain> {
	constructor(protected readonly tableName: string) {}

	protected get db(): Knex {
		return db
	}

	async findById(id: UUID): Promise<TDomain | null> {
		return this.findBy({ id })
	}

	async findBy(conditions: Record<string, unknown>): Promise<TDomain | null> {
		const row = (await this.db(this.tableName).where(conditions).first()) as
			| TDomain
			| undefined

		if (!row) {
			return null
		}

		return row
	}

	async findAll(): Promise<TDomain[]> {
		const rows = (await this.db(this.tableName).select('*')) as TDomain[]
		return rows
	}

	async findByIds(ids: UUID[]): Promise<TDomain[]> {
		if (ids.length === 0) {
			return []
		}
		const rows = (await this.db(this.tableName)
			.whereIn('id', ids)
			.select('*')) as TDomain[]
		return rows
	}

	async create(data: TDomain): Promise<void> {
		await this.db(this.tableName).insert(data)
	}

	async update(id: UUID, updates: Partial<TDomain>): Promise<void> {
		const result = await this.db(this.tableName).where({ id }).update(updates)

		if (result === 0) {
			throw new NotFoundError(`${this.tableName} not found`)
		}
	}

	async delete(id: UUID): Promise<void> {
		const result = await this.db(this.tableName).where({ id }).del()

		if (result === 0) {
			throw new NotFoundError(`${this.tableName} not found`)
		}
	}
}
