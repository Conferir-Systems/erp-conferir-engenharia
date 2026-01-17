import { Status, ApprovalStatus } from './contracts.js'
import type { UUID } from './common.js'

export type ContractItemParams = {
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	description: string
}

export type ContractItem = ContractItemParams & {
	id: UUID
	contractId: UUID
	totalValue: number
	createdAt?: Date
	updatedAt?: Date
}

export type ContractListItem = {
	id: UUID
	work: { id: UUID; name: string }
	supplier: { id: UUID; name: string }
	service: string
	totalValue: number
	startDate: Date
	deliveryTime: Date | null
	status: Status
	approvalStatus: ApprovalStatus
	retentionPercentage: number
}
