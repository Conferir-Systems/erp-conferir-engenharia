import type { UUID } from './common.js'

export type UserPermission = 'AUTHORIZED' | 'UNAUTHORIZED'

export type User = {
	id: UUID
	name: string
	email: string
	role: UserPermission
}
