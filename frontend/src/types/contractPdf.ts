import type { typePerson, UUID } from './index.js'

export type ItemData = {
	id: UUID
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	total: number
}

export type ContractData = {
	issueDate: string

	contractor: {
		name: string
		cnpj?: string
		cpf?: string
		address: string
		representative?: string
		cpfRepresentative?: string
	}

	supplier: {
		name: string
		document: string
		typePerson: typePerson
	}

	serviceDescription: string
	workName: string

	totalValue: number
	startDate: string
	deliveryTime: number

	items: ItemData[]
}
