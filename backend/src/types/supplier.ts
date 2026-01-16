export type TypePerson = 'FISICA' | 'JURIDICA'

export type Supplier = {
	id: string
	name: string
	typePerson: TypePerson
	document: string
	pix?: string
	createdAt?: Date
	updatedAt?: Date
}
