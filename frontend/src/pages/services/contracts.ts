import {
	ContractListItem,
	CreateContractRequest,
	ContractResponse,
} from '../../types/index'
import { api } from './api'

export type { ContractListItem, CreateContractRequest, ContractResponse }

export const contractsApi = {
	create: async (data: CreateContractRequest): Promise<ContractResponse> => {
		const response = await api.post<ContractResponse>('/contracts', data)
		return response.data
	},

	getAll: async (filters?: {
		workId?: string
		supplierId?: string
	}): Promise<ContractListItem[]> => {
		const params = new URLSearchParams()
		if (filters?.workId) params.append('workId', filters.workId)
		if (filters?.supplierId) params.append('supplierId', filters.supplierId)
		params.append('includeDetails', 'true')

		const queryString = params.toString()
		const url = `/contracts?${queryString}`
		const response = await api.get<ContractListItem[]>(url)
		return response.data
	},

	getById: async (id: string): Promise<ContractResponse> => {
		const response = await api.get<ContractResponse>(`/contracts/${id}`)
		return response.data
	},

	getActive: async (filters?: {
		workId?: string
		supplierId?: string
	}): Promise<ContractResponse[]> => {
		const params = new URLSearchParams()
		if (filters?.workId) params.append('workId', filters.workId)
		if (filters?.supplierId) params.append('supplierId', filters.supplierId)
		params.append('status', 'Ativo')
		params.append('includeDetails', 'true')

		const queryString = params.toString()
		const url = `/contracts?${queryString}`
		const response = await api.get<ContractResponse[]>(url)
		return response.data
	},
}
