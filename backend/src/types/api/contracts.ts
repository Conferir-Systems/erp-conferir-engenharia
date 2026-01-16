import { Work } from '../works.js'
import { Supplier } from '../supplier.js'
import { ContractItem } from '../contractItems.js'
import { Status, ApprovalStatus } from '../contracts.js'

export type ContractItemWithAccumulated = ContractItem & {
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
	status: Status
	approvalStatus: ApprovalStatus
	createdAt?: Date
	updatedAt?: Date
	items: ContractItemWithAccumulated[]
}
