import type { UUID } from './common.js'

export type TypePerson = 'FISICA' | 'JURIDICA'

export type Supplier = {
	id: UUID
	name: string
	typePerson: TypePerson
	document: string
	pix?: string
	createdAt?: Date
	updatedAt?: Date
}
