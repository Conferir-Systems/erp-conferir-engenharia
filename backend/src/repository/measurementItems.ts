import type { MeasurementItem, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'

export type IMeasurementItemRepository = {
	create(measurementItem: MeasurementItem): Promise<void>
	createMany(measurementItems: MeasurementItem[]): Promise<void>
	findByContractId(contractId: UUID): Promise<MeasurementItem[]>
	findByMeasurementId(measurementId: UUID): Promise<MeasurementItem[]>
}

class MeasurementItemRepository
	extends BaseRepository<MeasurementItem>
	implements IMeasurementItemRepository
{
	constructor() {
		super('measurement_items')
	}

	async createMany(measurementItems: MeasurementItem[]): Promise<void> {
		await this.db(this.tableName).insert(measurementItems)
	}

	async findByContractId(contractId: UUID): Promise<MeasurementItem[]> {
		const rows = await this.db(this.tableName)
			.join('measurements', 'measurementItems.measurementId', 'measurements.id')
			.where('measurements.contractId', contractId)
			.select('measurementItems.*')

		return rows
	}

	async findByMeasurementId(measurementId: UUID): Promise<MeasurementItem[]> {
		const rows = await this.db(this.tableName)
			.where('measurementId', measurementId)
			.select('*')

		return rows
	}
}

export const measurementItemRepository = new MeasurementItemRepository()
