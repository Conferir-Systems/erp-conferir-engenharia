import { randomUUID } from 'crypto'
import type {
	Contract,
	ContractItem,
	ContractListItem,
	UUID,
	ContractResponse,
} from '../types/index.js'
import { IContractRepository } from '../repository/contracts.js'
import { IWorkRepository } from '../repository/works.js'
import { ISupplierRepository } from '../repository/suppliers.js'
import { IContractItemRepository } from '../repository/contractItems.js'
import { IMeasurementItemRepository } from '../repository/measurementItems.js'

export type CreateContractParams = {
	workId: UUID
	supplierId: UUID
	service: string
	retentionPercentage: number
	startDate: string
	deliveryTime: string
	items: Omit<
		ContractItem,
		'id' | 'contractId' | 'createdAt' | 'updatedAt' | 'totalValue'
	>[]
}

export class ContractService {
	constructor(
		private contractRepo: IContractRepository,
		private workRepo: IWorkRepository,
		private supplierRepo: ISupplierRepository,
		private contractItemRepo: IContractItemRepository,
		private measurementItemRepo: IMeasurementItemRepository
	) {}

	async createContractWithItems(
		params: CreateContractParams
	): Promise<ContractResponse> {
		const contractId = randomUUID()

		const contractItems: ContractItem[] = params.items.map((item) => ({
			id: randomUUID(),
			contractId: contractId,
			unitMeasure: item.unitMeasure,
			quantity: item.quantity,
			unitLaborValue: item.unitLaborValue,
			totalValue: item.quantity * item.unitLaborValue,
			description: item.description,
		}))

		const totalValue = contractItems.reduce(
			(sum, item) => sum + item.totalValue,
			0
		)

		const { contract: createdContract, items } =
			await this.contractRepo.createContractWithItems({
				id: contractId,
				workId: params.workId,
				supplierId: params.supplierId,
				service: params.service.trim(),
				totalValue: totalValue,
				retentionPercentage: params.retentionPercentage,
				startDate: params.startDate,
				deliveryTime: params.deliveryTime,
				status: 'Ativo',
				approvalStatus: 'Pendente',
				items: contractItems,
			})

		const workId = createdContract.workId
		const supplierId = createdContract.supplierId

		const itemsWithAccumulated = items.map((item) => ({
			...item,
			accumulatedQuantity: 0,
		}))

		const contractResponse: ContractResponse = {
			id: createdContract.id,
			work: await this.workRepo.findById(workId),
			supplier: await this.supplierRepo.findById(supplierId),
			service: createdContract.service,
			totalValue: createdContract.totalValue,
			retentionPercentage: createdContract.retentionPercentage,
			startDate: createdContract.startDate,
			deliveryTime: createdContract.deliveryTime,
			status: createdContract.status,
			approvalStatus: createdContract.approvalStatus,
			createdAt: createdContract.createdAt,
			updatedAt: createdContract.updatedAt,
			items: itemsWithAccumulated,
		}

		return contractResponse
	}

	async getContract(id: UUID): Promise<Contract | null> {
		const contract = await this.contractRepo.findById(id)
		return contract
	}

	async getContractWithWorkAndSupplierData(
		id: UUID
	): Promise<ContractResponse | null> {
		const contract = await this.contractRepo.findById(id)

		if (!contract) return null

		const work = await this.workRepo.findById(contract.workId)
		const supplier = await this.supplierRepo.findById(contract.supplierId)
		const items = await this.contractItemRepo.findByContractId(contract.id)

		const measurementItems = await this.measurementItemRepo.findByContractId(id)
		const accumulatedByItem = new Map<string, number>()
		for (const measurementItem of measurementItems) {
			const current = accumulatedByItem.get(measurementItem.contractItemId) || 0
			accumulatedByItem.set(
				measurementItem.contractItemId,
				current + Number(measurementItem.quantity)
			)
		}

		const itemsWithAccumulated = items.map((item) => ({
			...item,
			accumulatedQuantity: accumulatedByItem.get(item.id) || 0,
		}))

		const contractResponse: ContractResponse = {
			id: contract.id,
			work: work,
			supplier: supplier,
			service: contract.service,
			totalValue: contract.totalValue,
			retentionPercentage: contract.retentionPercentage,
			startDate: contract.startDate,
			deliveryTime: contract.deliveryTime,
			status: contract.status,
			approvalStatus: contract.approvalStatus,
			createdAt: contract.createdAt,
			updatedAt: contract.updatedAt,
			items: itemsWithAccumulated,
		}

		return contractResponse
	}

	async getContracts(
		filters?: {
			workId?: string
			supplierId?: string
			status?: 'Ativo' | 'Concluído'
			approvalStatus?: 'Pendente' | 'Aprovado'
		},
		includeDetails?: boolean
	): Promise<ContractListItem[] | ContractResponse[]> {
		const contracts = await this.contractRepo.findAllWithFilters(filters)

		if (!contracts) return []

		if (!includeDetails) {
			return contracts
		}

		const contractsDetails = await Promise.all(
			contracts.map(async (contract) => {
				const fullContract = await this.getContractWithWorkAndSupplierData(
					contract.id
				)
				return fullContract
			})
		)

		return contractsDetails.filter(
			(contract): contract is ContractResponse => contract !== null
		)
	}
}
