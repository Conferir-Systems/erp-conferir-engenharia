import type {
	Measurement,
	CreateMeasurementInputRepository,
	MeasurementItem,
	MeasurementResponse,
	UUID,
} from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { ValidationError } from '../errors/ValidationError.js'

export type IMeasurementRepository = {
	create(measurement: Measurement): Promise<void>
	createMeasurementWithItems(
		data: CreateMeasurementInputRepository
	): Promise<{ measurement: Measurement; items: MeasurementItem[] }>
	findById(id: UUID): Promise<MeasurementResponse | null>
	findAll(): Promise<MeasurementResponse[] | null>
}

class MeasurementRepository
	extends BaseRepository<Measurement>
	implements IMeasurementRepository
{
	constructor() {
		super('measurements')
	}

	async findById(id: UUID): Promise<MeasurementResponse | null> {
		const row = await this.db(this.tableName)
			.where('id', id)
			.first<MeasurementResponse>()
		return row ? row : null
	}

	async findAll(): Promise<MeasurementResponse[]> {
		const rows = await this.db(this.tableName).orderBy('createdAt', 'desc')
		return rows
	}

	async createMeasurementWithItems(
		data: CreateMeasurementInputRepository
	): Promise<{ measurement: Measurement; items: MeasurementItem[] }> {
		const measurement: Measurement = {
			id: data.id,
			contractId: data.contractId,
			issueDate: data.issueDate,
			totalGrossValue: data.totalGrossValue,
			retentionValue: data.retentionValue,
			totalNetValue: data.totalNetValue,
			approvalStatus: data.approvalStatus,
			notes: data.notes,
		}

		const measurementItems: MeasurementItem[] = data.items

		if (measurementItems.length === 0) {
			throw new ValidationError('Minimal one item per measurement')
		}

		await this.db.transaction(async (trx) => {
			await trx(this.tableName).insert(measurement)

			await trx('measurement_items').insert(measurementItems)
		})

		return { measurement, items: measurementItems }
	}
}

export const measurementRepository = new MeasurementRepository()
