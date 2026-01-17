import { Status } from './contracts.js'
import type { UUID } from './common.js'

export type ContractItem = {
	id: UUID
	contractId: UUID
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	totalValue: number
	description: string
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
}
