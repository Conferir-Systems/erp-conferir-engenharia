import { randomUUID } from 'crypto'
import { Measurement, MeasurementParams } from '../types/measurements.js'
import {
	MeasurementItem,
	MeasurementItemInputRepository,
} from '../types/measurementItems.js'
import { IMeasurementRepository } from '../repository/measurements.js'
import { IContractRepository } from '../repository/contracts.js'

export class MeasurementService {
	constructor(
		private measurementRepo: IMeasurementRepository,
		private contractRepo: IContractRepository
	) {}

	async createMeasurementWithItems(
		params: MeasurementParams
	): Promise<{ measurement: Measurement; items: MeasurementItem[] }> {
		const measurementId = randomUUID()

		const contract = await this.contractRepo.findById(params.contractId)
		const retentionPercentage = contract?.retentionPercentage || 0

		const measurementItems: MeasurementItemInputRepository[] = params.items.map(
			(item) => ({
				id: randomUUID(),
				measurementId,
				contractItemId: item.contractItemId,
				quantity: item.quantity,
				unitLaborValue: item.unitLaborValue,
				totalGrossValue: item.quantity * item.unitLaborValue,
			})
		)

		const totalGrossValue = measurementItems.reduce(
			(sum, item) => sum + item.totalGrossValue,
			0
		)

		const retentionValue = totalGrossValue * (retentionPercentage / 100)

		const totalNetValue = totalGrossValue - retentionValue

		const createdMeasurement =
			await this.measurementRepo.createMeasurementWithItems({
				id: measurementId,
				contractId: params.contractId,
				issueDate: params.issueDate,
				totalGrossValue,
				retentionValue,
				totalNetValue,
				approvalStatus: 'PENDENTE',
				notes: params.notes,
				items: measurementItems,
			})

		return createdMeasurement
	}
}
