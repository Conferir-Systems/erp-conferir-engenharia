import { randomUUID } from 'node:crypto'
import type { UserResponse } from '../models/users/users'
import type { User } from '../models/users/users'
import { userRepository } from '../repository/users'
import { hashPassword } from './passwordHash'
import { userTypeRepository } from '../repository/userTypes'

export type CreateUserParams = {
  firstName: string
  lastName: string
  email: string
  password: string
  typeUser: string
}

export async function createUser(
  params: CreateUserParams
): Promise<UserResponse> {
  const createUserIntent: User = {
    id: randomUUID(),
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    passwordHash: await hashPassword(params.password),
    userType: params.typeUser,
  }

  await userRepository.createUser(createUserIntent)
  const createdUser = await userRepository.findById(createUserIntent.id)

  if (!createdUser) throw new Error('Failed to create user')

  const userTypeId = createUserIntent.userType
  const fullName: string = `${createUserIntent.firstName} ${createUserIntent.lastName}`

  const userResponse: UserResponse = {
    id: createUserIntent.id,
    fullName: fullName,
    email: createUserIntent.email,
    userType: await userTypeRepository.findById(userTypeId),
  }

  return userResponse
}
