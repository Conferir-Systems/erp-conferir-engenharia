import { randomUUID } from 'node:crypto'
import type { Work, CreateWorkRequest } from '../../models/works/works'
import { workRepository } from '../../repository/works/works'

export async function createWork(params: CreateWorkRequest): Promise<Work> {
  const createWorkIntent: Work = {
    id: params.id || randomUUID(),
    name: params.name,
    code: params.code ?? null,
    address: params.address,
    contractor: params.contractor ?? null,
    status: params.status || 'ATIVA',
  }

  await workRepository.create(createWorkIntent)
  const createdWork = await workRepository.findById(createWorkIntent.id)

  if (!createdWork) throw new Error('Failed to create work')

  return createdWork
}

export async function updateWork(
  id: string,
  data: Partial<Omit<Work, 'id'>>
): Promise<Work> {
  await workRepository.update(id, data)

  const updatedWork = await workRepository.findById(id)

  if (!updatedWork) throw new Error('Failed to retrieve updated work')

  return updatedWork
}

export async function deleteWork(id: string): Promise<void> {
  await workRepository.delete(id)

  const deletedWork = await workRepository.findById(id)

  if (deletedWork) throw new Error('Failed to retrieve delete work')
}
