import type { UUID, Work, Supplier } from './index.js'

export type ContractStatus = 'Active' | 'Completed'
export type ApprovalStatus = 'Pending' | 'Approved'

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
	approvalStatus: ApprovalStatus
	retentionPercentage: number
}

export type CreateContractItemRequest = {
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
}

export type CreateContractRequest = {
	workId: UUID
	supplierId: UUID
	service: string
	retentionPercentage: number
	startDate: string
	deliveryTime: string
	items: CreateContractItemRequest[]
}

export type ContractResponseItem = {
	id: UUID
	contractId: UUID
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	totalValue: number
	accumulatedQuantity: number
}

export type ContractResponse = {
	id: UUID
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
