import { randomUUID } from 'node:crypto'
import type { Work, CreateWorkRequest } from '../../types/works/works'
import { NotFoundError } from '../../errors'
import type { IWorkRepository } from '../../repository/works/works'

export class WorkService {
  constructor(private workRepo: IWorkRepository) {}

  async createWork(params: CreateWorkRequest): Promise<Work> {
    const createWorkIntent: Work = {
      id: randomUUID(),
      name: params.name,
      code: params.code ?? null,
      address: params.address,
      contractor: params.contractor ?? null,
      status: params.status || 'ATIVA',
    }

    await this.workRepo.createWork(createWorkIntent)
    const createdWork = await this.workRepo.findById(createWorkIntent.id)

    if (!createdWork) throw new NotFoundError('Failed to create work')

    return createdWork
  }

  async getWorkById(id: string): Promise<Work | null> {
    return await this.workRepo.findById(id)
  }
}
