import { Work } from '../works'
import { Supplier } from '../supplier'
import { ContractItem } from '../contractItems'

export type ContractResponse = {
	id: string
	work: Work | null
	supplier: Supplier | null
	service: string
	totalValue: number
	retentionPercentage: number
	startDate: Date
	deliveryTime: Date
	status: 'Ativo' | 'Encerrado'
	createdAt?: Date
	updatedAt?: Date
	items: ContractItem[]
}
