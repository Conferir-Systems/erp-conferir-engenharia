import type { UUID } from './common.js'

export type UserType = {
	id: UUID
	name: string
	approveMeasurement: boolean
	createdAt?: Date
	updatedAt?: Date
}
