import type { UUID } from './common.js'

export type MeasurementItemParams = {
	contractItemId: UUID
	quantity: number
}

export type MeasurementItem = MeasurementItemParams & {
	id: UUID
	measurementId: UUID
	unitLaborValue: number
	totalGrossValue: number
	createdAt?: Date
	updatedAt?: Date
}

export type MeasurementItemInputRepository = MeasurementItem & {
	measurementId: UUID
}
