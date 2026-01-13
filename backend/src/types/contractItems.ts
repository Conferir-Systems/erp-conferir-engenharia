export type ContractItem = {
	id: string
	contractId: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	totalValue: number
	description: string
	createdAt?: Date
	updatedAt?: Date
}

export type ContractListItem = {
	id: string
	work: { id: string; name: string }
	supplier: { id: string; name: string }
	service: string
	totalValue: number
	startDate: Date
	deliveryTime: Date | null
	status: 'Ativo' | 'Encerrado'
	percentage: number
}
