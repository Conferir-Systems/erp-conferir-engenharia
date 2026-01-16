import { ContractItem } from './contractItems'

export type Status = 'Ativo' | 'Concluído'
export type ApprovalStatus = 'Pendente' | 'Aprovado'

export type Contract = {
	id: string
	workId: string
	supplierId: string
	service: string
	totalValue: number
	retentionPercentage: number
	startDate: Date
	deliveryTime: Date
	status: Status
	approvalStatus: ApprovalStatus
	createdAt?: Date
	updatedAt?: Date
}

export type CreateContractInput = {
	workId: string
	supplierId: string
	retentionPercentage: number
	service: string
	startDate: string
	deliveryTime: string
	items: Omit<ContractItem, 'id' | 'contract' | 'created_at' | 'updated_at'>[]
}

export type CreateContractInputRepository = CreateContractInput & {
	id: string
	totalValue: number
	status: Status
	approvalStatus: ApprovalStatus
	items: ContractItem[]
}
