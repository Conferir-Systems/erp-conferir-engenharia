import type { UUID } from '../common.js'
import { WorkStatus } from '../works.js'

export type CreateWorkRequest = {
	name: string
	code: number
	address: string
	contractor?: string
	status?: WorkStatus
}

export type UpdateWorkRequest = {
	name?: string
	address?: string
	contractor?: string | null
	status?: WorkStatus
}

export type WorkResponse = {
	id: UUID
	name: string
	code: number
	address: string
	contractor: string | null
	status: WorkStatus
	createdAt?: Date
	updatedAt?: Date
}

export type WorkListResponse = {
	works: WorkResponse[]
	total: number
}

export type ListWorksQuery = {
	page?: number
	limit?: number
	search?: string
	status?: WorkStatus
	contractor?: string
	sortBy?: 'name' | 'code' | 'status' | 'createdAt'
	order?: 'asc' | 'desc'
}
