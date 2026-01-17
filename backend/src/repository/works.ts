import type { Work } from '../types/works.js'
import type { WorkDatabaseRow } from '../types/database.js'
import { BaseRepository } from './BaseRepository.js'
import type { UUID } from '../types/common.js'

export type IWorkRepository = {
	create(work: Work): Promise<void>
	update(id: UUID, updates: Partial<Omit<Work, 'id'>>): Promise<void>
	delete(id: UUID): Promise<void>
	findById(id: UUID): Promise<Work | null>
	findAll(): Promise<Work[]>
}

class WorkRepository
	extends BaseRepository<Work, WorkDatabaseRow>
	implements IWorkRepository
{
	constructor() {
		super('works')
	}

	protected toDomain(row: WorkDatabaseRow): Work {
		return {
			id: row.id,
			name: row.name,
			code: row.code,
			address: row.address,
			contractor: row.contractor,
			status: row.status,
		}
	}

	protected toDatabase(work: Work): WorkDatabaseRow {
		return {
			id: work.id,
			name: work.name,
			code: work.code,
			address: work.address,
			contractor: work.contractor,
			status: work.status,
		}
	}
}

export const workRepository = new WorkRepository()
