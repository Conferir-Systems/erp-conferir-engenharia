import type {
	Measurement,
	CreateMeasurementInputRepository,
} from '../types/measurements'
import type {
	MeasurementDatabaseRow,
	MeasurementItemDatabaseRow,
} from '../types/database.ts'
import type { MeasurementItem } from '../types/measurementItems.ts'
import type { MeasurementResponse } from '../types/api/measurements'
import type { UUID } from '../types/common.js'
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
	extends BaseRepository<Measurement, MeasurementDatabaseRow>
	implements IMeasurementRepository
{
	constructor() {
		super('measurements')
	}

	async findById(id: UUID): Promise<MeasurementResponse | null> {
		const row = await this.db(this.tableName).where('id', id).first()
		return row ? this.toDomain(row) : null
	}

	async findAll(): Promise<MeasurementResponse[]> {
		const rows = await this.db(this.tableName).orderBy('created_at', 'desc')
		return rows.map((row) => this.toDomain(row))
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
			await trx(this.tableName).insert(this.toDatabase(measurement))

			const itemsToInsert = measurementItems.map((item) =>
				this.measurementItemToDatabase(item)
			)
			await trx('measurement_items').insert(itemsToInsert)
		})

		return { measurement, items: measurementItems }
	}

	protected toDomain(row: MeasurementDatabaseRow): MeasurementResponse {
		return {
			id: row.id,
			contractId: row.contract_id,
			issueDate: row.issue_date,
			approvalStatus: row.approval_status,
			totalGrossValue: row.total_gross_value,
			retentionValue: row.retention_value,
			totalNetValue: row.total_net_value,
			notes: row.notes,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}
	}

	protected toDatabase(data: Measurement): Partial<MeasurementDatabaseRow> {
		return {
			id: data.id,
			contract_id: data.contractId,
			issue_date: data.issueDate,
			approval_date: data.approvalDate || null,
			approval_status: data.approvalStatus,
			total_gross_value: data.totalGrossValue,
			retention_value: data.retentionValue,
			total_net_value: data.totalNetValue,
			notes: data.notes,
		}
	}

	private measurementItemToDatabase(
		data: MeasurementItem
	): Partial<MeasurementItemDatabaseRow> {
		return {
			id: data.id,
			measurement_id: data.measurementId,
			contract_item_id: data.contractItemId,
			quantity: data.quantity,
			unit_labor_value: data.unitLaborValue,
			total_gross_value: data.totalGrossValue,
		}
	}
}

export const measurementRepository = new MeasurementRepository()
