export type MeasurementItemParams = {
	contractItemId: string
	quantity: number
	unitLaborValue: number
	totalGrossValue: number
}

export type MeasurementItem = MeasurementItemParams & {
	id: string
	measurementId: string
	createdAt?: Date
	updatedAt?: Date
}

export type MeasurementItemInputRepository = MeasurementItemParams & {
	id: string
	measurementId: string
}
