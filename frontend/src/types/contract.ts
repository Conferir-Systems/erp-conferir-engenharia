import type { UUID } from './common.js'

export type ContractStatus = 'Ativo' | 'Concluído'

export type ContractItem = {
	id: UUID
	contractId: UUID
	description: string
	unitMeasure: string
	quantity: number
	unitLaborValue: number
	totalValue: number
}

export type Contract = {
	id: UUID
	workId: UUID
	supplierId: UUID
	service: string
	totalValue: number
	startDate: Date
	deliveryTime: Date | null
	status: ContractStatus
	items: ContractItem[]
}

export type ContractListItem = {
	id: UUID
	work: { id: UUID; name: string }
	supplier: { id: UUID; name: string }
	service: string
	totalValue: number
	startDate: string
	deliveryTime: string | null
	status: ContractStatus
	percentage: number
}
