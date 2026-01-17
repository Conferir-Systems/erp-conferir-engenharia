import {
	CreateMeasurementRequest,
	MeasurementResponse,
	EnrichedMeasurementResponse,
	CreateMeasurementResponse,
} from '../../types'
import { api } from './api'

export type {
	CreateMeasurementItemRequest,
	CreateMeasurementRequest,
	MeasurementItemResponse,
	MeasurementResponse,
	EnrichedMeasurementResponse,
	CreateMeasurementResponse,
} from '../../types'

export const measurementsApi = {
	getAll: async (): Promise<EnrichedMeasurementResponse[]> => {
		const response =
			await api.get<EnrichedMeasurementResponse[]>('/measurements')
		return response.data
	},

	getById: async (id: string): Promise<MeasurementResponse> => {
		const response = await api.get<MeasurementResponse>(`/measurements/${id}`)
		return response.data
	},

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
