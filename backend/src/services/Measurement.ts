import { randomUUID } from 'crypto'
import { Measurement, MeasurementParams } from '../types/measurements.js'
import {
	MeasurementItem,
	MeasurementItemInputRepository,
} from '../types/measurementItems.js'
import { IMeasurementRepository } from '../repository/measurements.js'
import { IContractRepository } from '../repository/contracts.js'
import { IContractItemRepository } from '../repository/contractItems.js'
import { IMeasurementItemRepository } from '../repository/measurementItems.js'
import { NotFoundError } from '../errors/NotFoundError.js'
import { ValidationError } from '../errors/ValidationError.js'

export class MeasurementService {
	constructor(
		private measurementRepo: IMeasurementRepository,
		private contractRepo: IContractRepository,
		private contractItemRepo: IContractItemRepository,
		private measurementItemRepo: IMeasurementItemRepository
	) {}

	async createMeasurementWithItems(
		params: MeasurementParams
	): Promise<{ measurement: Measurement; items: MeasurementItem[] }> {
		const measurementId = randomUUID()
		const contractWithoutRetentionPercentage = 0
		const measurementIssueDate = new Date()

		const contract = await this.contractRepo.findById(params.contractId)
		if (!contract) {
			throw new NotFoundError(`Contract with id ${params.contractId} not found`)
		}

		const retentionPercentage =
			contract.retentionPercentage || contractWithoutRetentionPercentage

		const contractItemIds = params.items.map((item) => item.contractItemId)
		const contractItems =
			await this.contractItemRepo.findByIds(contractItemIds)

		const contractItemsMap = new Map(
			contractItems.map((item) => [item.id, item])
		)

		await this.validateAvailableQuantities(
			params.contractId,
			params.items,
			contractItemsMap
		)

		const measurementItems: MeasurementItemInputRepository[] = params.items.map(
			(item) => {
				const contractItem = contractItemsMap.get(item.contractItemId)
				if (!contractItem) {
					throw new NotFoundError(
						`Contract item with id ${item.contractItemId} not found`
					)
				}

				return {
					id: randomUUID(),
					measurementId,
					contractItemId: item.contractItemId,
					quantity: item.quantity,
					unitLaborValue: contractItem.unitLaborValue,
					totalGrossValue: item.quantity * contractItem.unitLaborValue,
				}
			}
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
				issueDate: measurementIssueDate,
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
