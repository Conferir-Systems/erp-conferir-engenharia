import type { UUID } from '../common.js'
import { Supplier } from '../supplier.js'

export type CreateSupplierRequest = {
	name: string
	typePerson: 'FISICA' | 'JURIDICA'
	document: string
	pix?: string
}

export type UpdateSupplierRequest = {
	name?: string
	typePerson?: 'FISICA' | 'JURIDICA'
	document?: string
	pix?: string
}

export type SupplierResponse = {
	id: UUID
	name: string
	typePerson: 'FISICA' | 'JURIDICA'
	document: string
	pix?: string
	createdAt: Date
	updatedAt: Date
}

export type SupplierListResponse = {
	suppliers: Supplier[]
	total: number
}
