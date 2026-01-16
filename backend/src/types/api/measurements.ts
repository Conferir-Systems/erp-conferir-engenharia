import { MeasurementItem } from '../measurementItems.js'
import { ApprovalStatus } from '../measurements.js'

export type MeasurementResponse = {
	id: string
	contractId: string
	issueDate: Date
	totalGrossValue: number
	retentionValue: number
	totalNetValue: number
	approvalDate?: Date | null
	status: ApprovalStatus
	notes?: string
	createdAt?: Date
	updatedAt?: Date
	items: MeasurementItem[]
}
