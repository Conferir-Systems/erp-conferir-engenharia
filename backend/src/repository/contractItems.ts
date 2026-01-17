import type { Knex } from 'knex'
import type { ContractItem, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'

export type IContractItemRepository = {
	createMany(
		contractItems: ContractItem[],
		trx?: Knex.Transaction
	): Promise<void>
	findById(id: UUID): Promise<ContractItem | null>
	findByIds(ids: UUID[]): Promise<ContractItem[]>
	findByContractId(contractId: UUID): Promise<ContractItem[]>
	findAll(): Promise<ContractItem[]>
}

class ContractItemRepository
	extends BaseRepository<ContractItem>
	implements IContractItemRepository
{
	constructor() {
		super('contract_items')
	}

	async createMany(
		contractItems: ContractItem[],
		trx?: Knex.Transaction
	): Promise<void> {
		const query = trx ?? this.db
		await query(this.tableName).insert(contractItems)
	}

	async findByIds(ids: UUID[]): Promise<ContractItem[]> {
		if (ids.length === 0) {
			return []
		}
		const rows = await this.db(this.tableName).whereIn('id', ids).select('*')

		return rows
	}

	async findByContractId(contractId: UUID): Promise<ContractItem[]> {
		const rows = await this.db(this.tableName).where({ contractId }).select('*')

		return rows
	}
}

export const contractItemRepository = new ContractItemRepository()
