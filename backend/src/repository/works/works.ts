import type { Work } from '../../models/works/works'
import { db } from '../../database/db'

class WorkRepository {
  async create(work: Work): Promise<void> {
    await db('works').insert(this.data(work))
  }

  async update(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void> {
    const response = await db('works').where({ id }).update(updates)

    if (response === 0) throw new Error('Work not found')
  }

  async delete(id: string): Promise<void> {
    const response = await db('works').where({ id }).del()

    if (response === 0) throw new Error('Work not found')
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
