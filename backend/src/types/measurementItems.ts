export type MeasurementItemParams = {
	contractItemId: string
	quantity: number
}

export type MeasurementItem = MeasurementItemParams & {
	id: string
	measurementId: string
	unitLaborValue: number
	totalGrossValue: number
	createdAt?: Date
	updatedAt?: Date
}

export type MeasurementItemInputRepository = MeasurementItem & {
	id: string
	measurementId: string
}
