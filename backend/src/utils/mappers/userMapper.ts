import type { UpdateUserRequest } from '../../types/index.js'
import { hashPassword } from '../passwordHash.js'

export async function mapUpdateUserRequestToDb(
	updates: UpdateUserRequest
): Promise<
	Partial<{
		firstName: string
		lastName: string
		email: string
		password: string
		userTypeId: string
	}>
> {
	const dbUpdates: Partial<{
		firstName: string
		lastName: string
		email: string
		password: string
		userTypeId: string
	}> = {}

	if (updates.firstName !== undefined) {
		dbUpdates.firstName = updates.firstName.trim()
	}
	if (updates.lastName !== undefined) {
		dbUpdates.lastName = updates.lastName.trim()
	}
	if (updates.email !== undefined) {
		dbUpdates.email = updates.email.trim().toLowerCase()
	}
	if (updates.password !== undefined) {
		dbUpdates.password = await hashPassword(updates.password)
	}
	if (updates.userTypeId !== undefined) {
		dbUpdates.userTypeId = updates.userTypeId
	}

	return dbUpdates
}
