import { ContractItem } from './contractItems.js'
import type { UUID } from './common.js'

export type Status = 'Active' | 'Completed'
export type ApprovalStatus = 'Pending' | 'Approved'

export type Contract = {
	id: UUID
	workId: UUID
	supplierId: UUID
	service: string
	totalValue: number
	retentionPercentage: number
	startDate: Date
	deliveryTime: Date
	status: Status
	approvalStatus: ApprovalStatus
	createdAt?: Date
	updatedAt?: Date
}

export type CreateContractInput = {
	workId: UUID
	supplierId: UUID
	retentionPercentage: number
	service: string
	startDate: string
	deliveryTime: string
	items: Omit<ContractItem, 'id' | 'contract' | 'created_at' | 'updated_at'>[]
}

export type CreateContractInputRepository = CreateContractInput & {
	id: UUID
	totalValue: number
	status: Status
	approvalStatus: ApprovalStatus
	items: ContractItem[]
}
