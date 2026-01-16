import { Work } from '../works'
import { Supplier } from '../supplier'
import { ContractItem } from '../contractItems'
import { Status, ApprovalStatus } from '../contracts'

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
	items: ContractItem[]
}
