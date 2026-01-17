import type { UUID } from './common.js'

export type User = {
	id: UUID
	firstName: string
	lastName: string
	email: string
	passwordHash: string
	userType: string
}
