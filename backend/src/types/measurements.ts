import {
	MeasurementItemInputRepository,
	MeasurementItemParams,
} from './measurementItems'

export type ApprovalStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO'

export type Measurement = {
	id: string
	contractId: string
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

export type MeasurementParams = {
	contractId: string
	issueDate: Date
	notes: string
	items: MeasurementItemParams[]
}

export type CreateMeasurementInputRepository = {
	id: string
	contractId: string
	issueDate: Date
	totalGrossValue: number
	retentionValue: number
	totalNetValue: number
	approvalStatus: ApprovalStatus
	notes?: string
	items: MeasurementItemInputRepository[]
}
