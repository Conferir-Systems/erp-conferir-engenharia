import { AuthUser } from '../types/auth'
import { User, UserPermission } from '../types/index'

export const mapUserTypeToRole = (authUser: AuthUser): UserPermission => {
	if (authUser.permissions?.approveMeasurement) {
		return 'AUTHORIZED'
	}

	return 'UNAUTHORIZED'
}

export const convertAuthUserToUser = (authUser: AuthUser): User => {
	return {
		id: authUser.id,
		name: `${authUser.firstName} ${authUser.lastName}`.trim(),
		email: authUser.email,
		role: mapUserTypeToRole(authUser),
	}
}
