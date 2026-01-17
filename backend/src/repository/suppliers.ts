import type { Supplier, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { duplicateError } from '../utils/duplicateValueError.js'

export type ISupplierRepository = {
	create(supplier: Supplier): Promise<void>
	findById(id: UUID): Promise<Supplier | null>
	findByIds(ids: UUID[]): Promise<Supplier[]>
	findAll(): Promise<Supplier[] | null>
	update(id: UUID, updates: Partial<Omit<Supplier, 'id'>>): Promise<void>
	delete(id: UUID): Promise<void>
}

class SupplierRepository
	extends BaseRepository<Supplier>
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
}

export const supplierRepository = new SupplierRepository()
