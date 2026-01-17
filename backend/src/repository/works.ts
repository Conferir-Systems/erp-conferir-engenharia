import type { Work, UUID } from '../types/index.js'
import { BaseRepository } from './BaseRepository.js'

export type IWorkRepository = {
	create(work: Work): Promise<void>
	update(id: UUID, updates: Partial<Omit<Work, 'id'>>): Promise<void>
	delete(id: UUID): Promise<void>
	findById(id: UUID): Promise<Work | null>
	findAll(): Promise<Work[]>
}

class WorkRepository extends BaseRepository<Work> implements IWorkRepository {
	constructor() {
		super('works')
	}
}

export const workRepository = new WorkRepository()
