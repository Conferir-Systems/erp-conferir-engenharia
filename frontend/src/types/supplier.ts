import type { UUID } from './common.js'

export type Supplier = {
	id: UUID
	name: string
	typePerson: 'FISICA' | 'JURIDICA'
	document: string
	pix?: string
	createdAt?: string
	updatedAt?: string
}
