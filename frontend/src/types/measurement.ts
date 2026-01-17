import type { UUID, Contract, Work, Supplier } from './index.js'

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

export type CreateMeasurementItemRequest = {
	contractItemId: UUID
	quantity: number
}

export type CreateMeasurementRequest = {
	contractId: UUID
	notes?: string
	items: CreateMeasurementItemRequest[]
}

export type MeasurementItemResponse = {
	id: UUID
	measurementId: UUID
	contractItemId: UUID
	quantity: number
	unitLaborValue: number
	totalGrossValue: number
	createdAt?: string
	updatedAt?: string
}

export type MeasurementResponse = {
	id: UUID
	contractId: UUID
	issueDate: string
	totalGrossValue: number
	retentionValue: number
	totalNetValue: number
	approvalDate?: string | null
	approvalStatus: ApprovalStatus
	notes?: string
	createdAt?: string
	updatedAt?: string
}

export type EnrichedMeasurementResponse = MeasurementResponse & {
	contract: {
		id: UUID
		service: string
		workId: string
		supplierId: string
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

export type CreateMeasurementResponse = {
	measurement: MeasurementResponse
	items: MeasurementItemResponse[]
}
