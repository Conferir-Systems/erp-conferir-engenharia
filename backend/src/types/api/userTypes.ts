import type { UUID } from '../common.js'

export type CreateUserTypeRequest = {
	name: string
}

export type UpdateUserTypeRequest = {
	name?: string
	approveMeasurement?: boolean
}

export type UserTypeResponse = {
	id: UUID
	name: string
}

export type UserTypeListResponse = {
	userTypes: UserTypeResponse[]
	total: number
}

export type ListUserTypesQuery = {
	page?: number
	limit?: number
	search?: string
	sortBy?: 'name' | 'createdAt'
	order?: 'asc' | 'desc'
}
