import type { typePerson, UUID } from './index.js'

export type Supplier = {
	id: UUID
	name: string
	typePerson: typePerson
	document: string
	pix?: string
	createdAt?: string
	updatedAt?: string
}

export type CreateSupplierRequest = {
	name: string
	typePerson: typePerson
	document: string
	pix?: string
}

export type UpdateSupplierRequest = {
	name?: string
	typePerson?: typePerson
	document?: string
	pix?: string
}
