import type { UserType, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'
import { ConflictError } from '../errors/index.js'

export type IUserTypeRepository = {
	create(userType: UserType): Promise<void>
	findById(id: UUID): Promise<UserType | null>
	findAll(): Promise<UserType[]>
	update(id: UUID, updates: Partial<Omit<UserType, 'id'>>): Promise<void>
	delete(id: UUID): Promise<void>
}

class UserTypeRepository
	extends BaseRepository<UserType>
	implements IUserTypeRepository
{
	constructor() {
		super('user_types')
	}

	async create(userType: UserType): Promise<void> {
		if (await this.findBy({ name: userType.name })) {
			throw new ConflictError('User type already exists')
		}

		await super.create(userType)
	}
}

export const userTypeRepository = new UserTypeRepository()
