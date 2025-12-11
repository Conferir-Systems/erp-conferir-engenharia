import { randomUUID } from 'node:crypto'
import type { User } from '../model/users'
import { userRepository } from '../repository/users'
import { hashPassword } from './passwordHash'

export type CreateUserParams = {
  email: string
  password: string
}

export async function createUser(params: CreateUserParams): Promise<User> {
  const createUserIntent: User = {
    id: randomUUID(),
    email: params.email,
    passwordHash: await hashPassword(params.password),
  }

  await userRepository.saveUser(createUserIntent)
  const createdUser = await userRepository.findById(createUserIntent.id)

  if (!createdUser) throw new Error('Failed to create user')

  return createdUser
}
