import type { UUID } from './common.js'
import type { Contract } from './contract.js'
import type { Work } from './work.js'
import type { Supplier } from './supplier.js'

export type ApprovalStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

export type MeasurementItem = {
	id: UUID
	measurementId: UUID
	contractItemId: UUID
	quantity: number
	unitLaborValue: number
	totalGrossValue: number
	createdAt?: Date
	updatedAt?: Date
}

export type Measurement = {
	id: UUID
	contractId: UUID
	issueDate: Date
	totalGrossValue: number
	retentionValue: number
	totalNetValue: number
	approvalDate?: Date | null
	approvalStatus: ApprovalStatus
	notes?: string
	createdAt?: string
	updatedAt?: string
	items: MeasurementItem[]
}

export type EnrichedMeasurement = Measurement & {
	contract: Contract
	work: Work
	supplier: Supplier
	creatorName: string
}
