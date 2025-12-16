import type { Work } from '../../types/works/works'
import { db } from '../../database/db'
import { NotFoundError } from '../../errors'

export interface IWorkRepository {
  create(work: Work): Promise<void>
  update(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Work | null>
}

class WorkRepository implements IWorkRepository {
  async create(work: Work): Promise<void> {
    await db('works').insert(this.data(work))
  }

  async update(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void> {
    const result = await db('works').where({ id }).update(updates)

    if (result === 0) {
      throw new NotFoundError('Work not found')
    }
  }

  async delete(id: string): Promise<void> {
    const result = await db('works').where({ id }).del()

    if (result === 0) {
      throw new NotFoundError('Work not found')
    }
  }

  async findById(id: string): Promise<Work | null> {
    const work = await db('works').where({ id }).first()

    if (!work) {
      return null
    }

    return this.data(work)
  }

  private data(row: Work): Work {
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
