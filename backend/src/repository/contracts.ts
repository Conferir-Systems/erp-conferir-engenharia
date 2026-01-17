import type {
	Contract,
	CreateContractInputRepository,
	Status,
	ContractQueryRow,
	UUID,
	ContractItem,
	ContractListItem,
} from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { ValidationError } from '../errors/ValidationError.js'

export type IContractRepository = {
	createContractWithItems(
		data: CreateContractInputRepository
	): Promise<{ contract: Contract; items: ContractItem[] }>
	findAllWithFilters(filters?: {
		workId?: string
		supplierId?: string
		status?: Status
		approvalStatus?: 'Pendente' | 'Aprovado'
	}): Promise<ContractListItem[]>
	findById(id: UUID): Promise<Contract | null>
	findAll(): Promise<Contract[] | null>
	updateStatus(id: UUID, status: Status): Promise<void>
}

class ContractRepository
	extends BaseRepository<Contract>
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
			await trx(this.tableName).insert(contract)

			await trx('contract_items').insert(contractItems)
		})

		const createdContract = await this.findById(data.id)
		if (!createdContract) {
			throw new Error('Failed to retrieve created contract')
		}

		return { contract: createdContract, items: contractItems }
	}

	async updateStatus(id: UUID, status: Status): Promise<void> {
		await this.db(this.tableName)
			.where('id', id)
			.update({ status, updatedAt: new Date() })
	}

	async findAllWithFilters(filters?: {
		workId?: UUID
		supplierId?: UUID
		status?: Status
		approvalStatus?: 'Pendente' | 'Aprovado'
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

		if (filters?.status) {
			query = query.where('contracts.status', filters.status)
		}

		if (filters?.approvalStatus) {
			query = query.where('contracts.approval_status', filters.approvalStatus)
		}

		const rows = await query

		return rows.map((row: ContractQueryRow) => ({
			id: row.id,
			work: { id: row.workId, name: row.workName },
			supplier: { id: row.supplierId, name: row.supplierName },
			service: row.service,
			totalValue: row.totalValue,
			startDate: row.startDate,
			deliveryTime: row.deliveryTime,
			status: row.status,
			retentionPercentage: row.retentionPercentage,
		}))
	}
}

export const contractRepository = new ContractRepository()
