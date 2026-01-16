import type { MeasurementItem } from '../types/measurementItems'
import type { MeasurementItemDatabaseRow } from '../types/database'
import { BaseRepository } from './BaseRepository'

export interface IMeasurementItemRepository {
	create(measurementItem: MeasurementItem): Promise<void>
	createMany(measurementItems: MeasurementItem[]): Promise<void>
	findByContractId(contractId: string): Promise<MeasurementItem[]>
}

class MeasurementItemRepository
	extends BaseRepository<MeasurementItem, MeasurementItemDatabaseRow>
	implements IMeasurementItemRepository
{
	constructor() {
		super('measurement_items')
	}

	async createMany(measurementItems: MeasurementItem[]): Promise<void> {
		const databaseRows = measurementItems.map((item) => this.toDatabase(item))
		await this.db(this.tableName).insert(databaseRows)
	}

	async findByContractId(contractId: string): Promise<MeasurementItem[]> {
		const rows = (await this.db(this.tableName)
			.join(
				'measurements',
				'measurement_items.measurement_id',
				'measurements.id'
			)
			.where('measurements.contract_id', contractId)
			.select('measurement_items.*')) as MeasurementItemDatabaseRow[]

		return rows.map((row) => this.toDomain(row))
	}

	protected toDomain(row: MeasurementItemDatabaseRow): MeasurementItem {
		return {
			id: row.id,
			measurementId: row.measurement_id,
			contractItemId: row.contract_item_id,
			quantity: row.quantity,
			unitLaborValue: row.unit_labor_value,
			totalGrossValue: row.total_gross_value,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}
	}

	protected toDatabase(
		data: MeasurementItem
	): Partial<MeasurementItemDatabaseRow> {
		return {
			id: data.id,
			measurement_id: data.measurementId,
			contract_item_id: data.contractItemId,
			quantity: data.quantity,
			unit_labor_value: data.unitLaborValue,
			total_gross_value: data.totalGrossValue,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		}
	}
}

export const measurementItemRepository = new MeasurementItemRepository()
