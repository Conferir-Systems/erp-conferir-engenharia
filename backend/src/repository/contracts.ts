import type {
	Contract,
	CreateContractInputRepository,
	Status,
	UUID,
	ContractItem,
	ContractListItem,
} from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { ValidationError } from '../errors/ValidationError.js'
import { ApprovalStatus } from '../types/contracts.js'
import { contractItemRepository } from './contractItems.js'
import { workRepository } from './works.js'
import { supplierRepository } from './suppliers.js'

export type IContractRepository = {
	createContractWithItems(
		data: CreateContractInputRepository
	): Promise<{ contract: Contract; items: ContractItem[] }>
	findAllWithFilters(filters?: {
		workId?: string
		supplierId?: string
		status?: Status
		approvalStatus?: ApprovalStatus
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
			await contractItemRepository.createMany(contractItems, trx)
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
		approvalStatus?: ApprovalStatus
	}): Promise<ContractListItem[]> {
		let query = this.db(this.tableName).select<Contract[]>('*')

		if (filters?.workId) {
			query = query.where('work_id', filters.workId)
		}

		if (filters?.supplierId) {
			query = query.where('supplier_id', filters.supplierId)
		}

		if (filters?.status) {
			query = query.where('status', filters.status)
		}

		if (filters?.approvalStatus) {
			query = query.where('approval_status', filters.approvalStatus)
		}

		const contracts = await query

		const workIds = [...new Set(contracts.map((c) => c.workId))]
		const supplierIds = [...new Set(contracts.map((c) => c.supplierId))]

		const [works, suppliers] = await Promise.all([
			workRepository.findByIds(workIds),
			supplierRepository.findByIds(supplierIds),
		])

		const worksMap = new Map(works.map((w) => [w.id, w]))
		const suppliersMap = new Map(suppliers.map((s) => [s.id, s]))

		return contracts.map((contract) => {
			const work = worksMap.get(contract.workId)
			const supplier = suppliersMap.get(contract.supplierId)

			return {
				id: contract.id,
				work: { id: contract.workId, name: work?.name ?? '' },
				supplier: { id: contract.supplierId, name: supplier?.name ?? '' },
				service: contract.service,
				totalValue: contract.totalValue,
				startDate: contract.startDate,
				deliveryTime: contract.deliveryTime,
				status: contract.status,
				approvalStatus: contract.approvalStatus,
				retentionPercentage: contract.retentionPercentage,
			}
		})
	}
}

export const contractRepository = new ContractRepository()
