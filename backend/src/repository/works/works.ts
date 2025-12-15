import type { Work } from '../../types/works/works'
import { db } from '../../database/db'
import { NotFoundError } from '../../errors'

export interface IWorkRepository {
  createWork(work: Work): Promise<void>
  updateWork(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void>
  findById(id: string): Promise<Work | null>
}

class WorkRepository implements IWorkRepository {
  async createWork(work: Work): Promise<void> {
    await db('works').insert(this.workData(work))
  }

  async updateWork(
    id: string,
    updates: Partial<Omit<Work, 'id'>>
  ): Promise<void> {
    const result = await db('works').where({ id }).update(updates)

    if (result === 0) {
      throw new NotFoundError('Work not found')
    }
  }

  async findById(id: string): Promise<Work | null> {
    const work = await db('works').where({ id }).first()

    if (!work) {
      return null
    }

    return this.workData(work)
  }

  private workData(row: Work): Work {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      address: row.address,
      contractor: row.contractor,
      status: row.status,
    }
  }
}

export const workRepository = new WorkRepository()
