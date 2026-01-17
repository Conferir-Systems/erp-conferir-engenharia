import type { UUID } from './common.js'
import type { Work } from './work.js'
import type { Supplier } from './supplier.js'

export type ContractStatus = 'Ativo' | 'Concluído'

export type ContractItem = {
	id: UUID
	contractId: UUID
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	totalValue: number
}

export type Contract = {
	id: UUID
	workId: UUID
	supplierId: UUID
	service: string
	totalValue: number
	startDate: Date
	deliveryTime: Date | null
	status: ContractStatus
	items: ContractItem[]
}

export type ContractListItem = {
	id: UUID
	work: { id: UUID; name: string }
	supplier: { id: UUID; name: string }
	service: string
	totalValue: number
	startDate: string
	deliveryTime: string | null
	status: ContractStatus
	percentage: number
}

export type CreateContractItemRequest = {
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
}

export type CreateContractRequest = {
	workId: string
	supplierId: string
	service: string
	retentionPercentage: number
	startDate: string
	deliveryTime: string
	items: CreateContractItemRequest[]
}

export type ContractResponseItem = {
	id: string
	contractId: string
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	totalValue: number
	accumulatedQuantity: number
}

export type ContractResponse = {
	id: string
	work: Work | null
	supplier: Supplier | null
	service: string
	totalValue: number
	retentionPercentage: number
	startDate: Date
	deliveryTime: Date
	status: string
	items: ContractResponseItem[]
}
