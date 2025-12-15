import { randomUUID } from 'node:crypto'
import type { Work, CreateWorkRequest } from '../../models/works/works'
import { workRepository } from '../../repository/works/works'

export async function createWork(params: CreateWorkRequest): Promise<Work> {
  const createWorkIntent: Work = {
    id: randomUUID(),
    name: params.name,
    code: params.code ?? null,
    address: params.address,
    contractor: params.contractor ?? null,
    status: params.status || 'ATIVA',
  }

  await workRepository.createWork(createWorkIntent)
  const createdWork = await workRepository.findById(createWorkIntent.id)

  if (!createdWork) throw new Error('Failed to create work')

  return createdWork
}
