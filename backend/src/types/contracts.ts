import { ContractItem } from './contractItems'

export type ContractStatus = 'Ativo' | 'Encerrado'

export type Contract = {
	id: string
	workId: string
	supplierId: string
	service: string
	totalValue: number
	startDate: Date
	deliveryTime: Date
	status: ContractStatus
	createdAt?: Date
	updatedAt?: Date
}

export type CreateContractInput = {
	work_id: string
	supplier_id: string
	service: string
	start_date: string
	delivery_time: string
	items: Omit<ContractItem, 'id' | 'contract' | 'created_at' | 'updated_at'>[]
}

export type CreateContractInputRepository = CreateContractInput & {
	id: string
	totalValue: number
	status: 'Ativo'
	items: ContractItem[]
}
