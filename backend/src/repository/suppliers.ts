import type { Supplier, SupplierDatabaseRow, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { duplicateError } from '../utils/duplicateValueError.js'

export type ISupplierRepository = {
	create(supplier: Supplier): Promise<void>
	findById(id: UUID): Promise<Supplier | null>
	findAll(): Promise<Supplier[] | null>
	update(
		id: UUID,
		updates: Partial<Omit<SupplierDatabaseRow, 'id'>>
	): Promise<void>
	delete(id: UUID): Promise<void>
}

class SupplierRepository
	extends BaseRepository<Supplier, SupplierDatabaseRow>
	implements ISupplierRepository
{
	constructor() {
		super('suppliers')
	}

	async create(supplier: Supplier): Promise<void> {
		try {
			await super.create(supplier)
		} catch (err) {
			duplicateError(err, 'suppliers', 'name')
			duplicateError(err, 'suppliers', 'document')
			duplicateError(err, 'suppliers', 'pix')

			throw err
		}
	}

	protected toDatabase(data: Supplier): Partial<SupplierDatabaseRow> {
		return {
			id: data.id,
			name: data.name,
			type_person: data.typePerson,
			document: data.document,
			pix: data.pix,
		}
	}

	protected toDomain(row: SupplierDatabaseRow): Supplier {
		return {
			id: row.id,
			name: row.name,
			typePerson: row.type_person,
			document: row.document,
			pix: row.pix,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}
	}
}

export const supplierRepository = new SupplierRepository()
