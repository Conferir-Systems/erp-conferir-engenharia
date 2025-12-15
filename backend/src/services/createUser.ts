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

function validateName(name: string, fieldName: string): void {
  const trimmed = name.trim()

  if (!trimmed || trimmed.length === 0) {
    throw new Error(`${fieldName} is required`)
  }

  if (trimmed.length < 2 || trimmed.length > 50) {
    throw new Error(`${fieldName} must be between 2 and 50 characters`)
  }

  if (/["'`<>\\;]/.test(trimmed)) {
    throw new Error(`${fieldName} contains invalid characters`)
  }

  if (/\d/.test(trimmed)) {
    throw new Error(`${fieldName} cannot contain numbers`)
  }

  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
    throw new Error(`${fieldName} contains invalid characters`)
  }
}

function validateEmail(email: string): void {
  const trimmed = email.trim()

  if (!trimmed || trimmed.length === 0) {
    throw new Error('Email is required')
  }

  if (trimmed.length > 100) {
    throw new Error('Email must be at most 100 characters')
  }

  if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
    throw new Error('Email cannot contain quotes')
  }

  if (/[<>\\;()[\]{}|~!#$%^&*=+]/.test(trimmed)) {
    throw new Error('Email contains invalid characters')
  }

  if (/\s/.test(trimmed)) {
    throw new Error('Email cannot contain spaces')
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email format')
  }

  if (trimmed.includes('..')) {
    throw new Error('Email cannot contain consecutive dots')
  }
}

function validatePassword(password: string): void {
  if (!password || password.length === 0) {
    throw new Error('Password is required')
  }

  if (password.length < 8 || password.length > 100) {
    throw new Error('Password must be between 8 and 100 characters')
  }

  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    throw new Error('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    throw new Error('Password must contain at least one special character')
  }

  if (/\s/.test(password)) {
    throw new Error('Password cannot contain spaces')
  }
}

export async function createUser(
  params: CreateUserParams
): Promise<UserResponse> {
  validateName(params.firstName, 'First name')
  validateName(params.lastName, 'Last name')
  validateEmail(params.email)
  validatePassword(params.password)

  if (!params.typeUser || params.typeUser.trim().length === 0) {
    throw new Error('User type is required')
  }

  const createUserIntent: User = {
    id: randomUUID(),
    firstName: params.firstName.trim(),
    lastName: params.lastName.trim(),
    email: params.email.trim().toLowerCase(),
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
