import type {
	Contract,
	CreateContractInputRepository,
} from '../types/contracts.js'
import type {
	ContractDatabaseRow,
	ContractQueryRow,
} from '../types/database.js'
import type { ContractItem, ContractListItem } from '../types/contractItems.js'
import { BaseRepository } from './BaseRepository.js'
import { contractItemRepository } from './contractItems.js'
import { ValidationError } from '../errors/ValidationError.js'

export interface IContractRepository {
	createContractWithItems(
		data: CreateContractInputRepository
	): Promise<{ contract: Contract; items: ContractItem[] }>
	findAllWithFilters(filters?: {
		workId?: string
		supplierId?: string
	}): Promise<ContractListItem[]>
	findById(id: string): Promise<Contract | null>
	findAll(): Promise<Contract[] | null>
}

class ContractRepository
	extends BaseRepository<Contract, ContractDatabaseRow>
	implements IContractRepository
{
	constructor() {
		super('contracts')
	}

	async createContractWithItems(
		data: CreateContractInputRepository
	): Promise<{ contract: Contract; items: ContractItem[] }> {
		const contract: Contract = {
			id: data.id,
			workId: data.work_id,
			supplierId: data.supplier_id,
			service: data.service,
			totalValue: data.totalValue,
			retentionPercentage: data.retention_percentage,
			startDate: new Date(data.start_date),
			deliveryTime: new Date(data.delivery_time),
			status: data.status,
		}

		const contractItems: ContractItem[] = data.items

		if (contractItems.length === 0) {
			throw new ValidationError('Minimal one item per contract')
		}

		await this.db.transaction(async (trx) => {
			await trx(this.tableName).insert(this.toDatabase(contract))

			const itemsToInsert = contractItems.map((item) =>
				contractItemRepository['toDatabase'](item)
			)
			await trx('contract_items').insert(itemsToInsert)
		})

		return { contract, items: contractItems }
	}

	async findAllWithFilters(filters?: {
		workId?: string
		supplierId?: string
	}): Promise<ContractListItem[]> {
		let query = this.db('contracts')
			.select<
				ContractQueryRow[]
			>('contracts.id', 'contracts.service', 'contracts.total_value', 'contracts.retention_percentage', 'contracts.start_date', 'contracts.delivery_time', 'contracts.status', 'works.id as work_id', 'works.name as work_name', 'suppliers.id as supplier_id', 'suppliers.name as supplier_name')
			.leftJoin('works', 'contracts.work_id', 'works.id')
			.leftJoin('suppliers', 'contracts.supplier_id', 'suppliers.id')

		if (filters?.workId) {
			query = query.where('contracts.work_id', filters.workId)
		}

		if (filters?.supplierId) {
			query = query.where('contracts.supplier_id', filters.supplierId)
		}

		const rows = await query

		return rows.map((row: ContractQueryRow) => ({
			id: row.id,
			work: { id: row.work_id, name: row.work_name },
			supplier: { id: row.supplier_id, name: row.supplier_name },
			service: row.service,
			totalValue: row.total_value,
			startDate: row.start_date,
			deliveryTime: row.delivery_time,
			status: row.status,
			retentionPercentage: row.retention_percentage,
		}))
	}

	protected toDomain(row: ContractDatabaseRow): Contract {
		return {
			id: row.id,
			workId: row.work_id,
			supplierId: row.supplier_id,
			service: row.service,
			totalValue: row.total_value,
			retentionPercentage: row.retention_percentage,
			startDate: row.start_date,
			deliveryTime: row.delivery_time,
			status: row.status,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}
	}

	protected toDatabase(data: Contract): ContractDatabaseRow {
		return {
			id: data.id,
			work_id: data.workId,
			supplier_id: data.supplierId,
			service: data.service,
			total_value: data.totalValue,
			retention_percentage: data.retentionPercentage,
			start_date: data.startDate,
			delivery_time: data.deliveryTime,
			status: data.status,
			created_at: data.createdAt ?? new Date(),
			updated_at: data.updatedAt ?? new Date(),
		}
	}
}

export const contractRepository = new ContractRepository()
