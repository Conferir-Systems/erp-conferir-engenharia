import {
	MeasurementItemInputRepository,
	MeasurementItemParams,
} from './measurementItems.js'
import type { UUID } from './common.js'

export type ApprovalStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO'

export type MeasurementParams = {
	contractId: UUID
	notes?: string
	items: MeasurementItemParams[]
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
}

export type CreateMeasurementInputRepository = Measurement & {
	items: MeasurementItemInputRepository[]
}

export type EnrichedMeasurement = Measurement & {
	contract: {
		id: UUID
		service: string
		workId: UUID
		supplierId: UUID
	}
	work: {
		id: UUID
		name: string
	}
	supplier: {
		id: UUID
		name: string
	}
}
