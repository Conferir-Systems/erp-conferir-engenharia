import { api } from './api'

// Request types (matches backend validation schema)
export interface CreateMeasurementItemRequest {
	contractItemId: string
	quantity: number
}

export interface CreateMeasurementRequest {
	contractId: string
	notes?: string
	items: CreateMeasurementItemRequest[]
}

// Response types (matches backend response)
export interface MeasurementItemResponse {
	id: string
	measurementId: string
	contractItemId: string
	quantity: number
	unitLaborValue: number
	totalGrossValue: number
	createdAt?: string
	updatedAt?: string
}

export interface MeasurementResponse {
	id: string
	contractId: string
	issueDate: string
	totalGrossValue: number
	retentionValue: number
	totalNetValue: number
	approvalStatus: 'PENDENTE' | 'APROVADO' | 'REJEITADO'
	notes?: string
	createdAt?: string
	updatedAt?: string
}

export interface CreateMeasurementResponse {
	measurement: MeasurementResponse
	items: MeasurementItemResponse[]
}

export const measurementsApi = {
	create: async (
		data: CreateMeasurementRequest
	): Promise<CreateMeasurementResponse> => {
		const response = await api.post<CreateMeasurementResponse>(
			'/measurements',
			data
		)
		return response.data
	},
}
