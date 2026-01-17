import { MeasurementItem } from '../measurementItems.js'
import { ApprovalStatus } from '../measurements.js'
import type { UUID } from '../common.js'

export type MeasurementResponse = {
	id: UUID
	contractId: UUID
	issueDate: Date
	totalGrossValue: number
	retentionValue: number
	totalNetValue: number
	approvalDate?: Date | null
	approvalStatus: ApprovalStatus
	notes?: string
	createdAt?: Date
	updatedAt?: Date
}

export type MeasurementWithItemsResponse = MeasurementResponse & {
	items: MeasurementItem[]
}
