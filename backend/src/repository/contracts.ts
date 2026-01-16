import type {
	Contract,
	CreateContractInputRepository,
	Status,
} from '../types/contracts.js'
import type {
	ContractDatabaseRow,
	ContractQueryRow,
	ContractItemDatabaseRow,
} from '../types/database.js'
import type { ContractItem, ContractListItem } from '../types/contractItems.js'
import { BaseRepository } from './BaseRepository.js'
import { ValidationError } from '../errors/ValidationError.js'

export type IContractRepository = {
	createContractWithItems(
		data: CreateContractInputRepository
	): Promise<{ contract: Contract; items: ContractItem[] }>
	findAllWithFilters(filters?: {
		workId?: string
		supplierId?: string
	}): Promise<ContractListItem[]>
	findById(id: string): Promise<Contract | null>
	findAll(): Promise<Contract[] | null>
	updateStatus(id: string, status: Status): Promise<void>
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
			workId: data.workId,
			supplierId: data.supplierId,
			service: data.service,
			totalValue: data.totalValue,
			retentionPercentage: data.retentionPercentage,
			startDate: new Date(data.startDate),
			deliveryTime: new Date(data.deliveryTime),
			status: data.status,
			approvalStatus: data.approvalStatus,
		}

		const contractItems: ContractItem[] = data.items

		if (contractItems.length === 0) {
			throw new ValidationError('Minimal one item per contract')
		}

		await this.db.transaction(async (trx) => {
			await trx(this.tableName).insert(this.toDatabase(contract))

			const itemsToInsert = contractItems.map((item) =>
				this.contractItemToDatabase(item)
			)
			await trx('contract_items').insert(itemsToInsert)
		})

		const createdContract = await this.findById(data.id)
		if (!createdContract) {
			throw new Error('Failed to retrieve created contract')
		}

		return { contract: createdContract, items: contractItems }
	}

	async updateStatus(id: string, status: Status): Promise<void> {
		await this.db(this.tableName)
			.where('id', id)
			.update({ status, updated_at: new Date() })
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
			approvalStatus: row.approval_status,
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
			approval_status: data.approvalStatus,
			created_at: data.createdAt ?? new Date(),
			updated_at: data.updatedAt ?? new Date(),
		}
	}

	private contractItemToDatabase(
		data: ContractItem
	): Partial<ContractItemDatabaseRow> {
		return {
			id: data.id,
			contract_id: data.contractId,
			unit_measure: data.unitMeasure,
			quantity: data.quantity,
			unit_labor_value: data.unitLaborValue,
			total_value: data.totalValue,
			description: data.description,
		}
	}
}

export const contractRepository = new ContractRepository()
