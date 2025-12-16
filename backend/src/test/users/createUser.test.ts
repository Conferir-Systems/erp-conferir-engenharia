import { describe, it, expect, beforeEach } from 'vitest'
import { createUser, CreateUserParams } from '../../services/users/createUser'
import { createUserType } from '../../services/users/createUserType'
import { db } from '../../database/db'
import { verifyPassword } from '../../services/users/passwordHash'

describe('createUser - Integration Tests', () => {
  let testUserTypeId: string

  beforeEach(async () => {
    const userType = await createUserType({ name: 'Visitor' })
    testUserTypeId = userType.id
  })

  describe('when creating a new user', () => {
    it('creates a user in the database with hashed password', async () => {
      const createUserParams: CreateUserParams = {
        email: 'test@example.com',
        password: 'Alexa123',
        type_user_id: testUserTypeId,
      }

      const createdUser = await createUser(createUserParams)

      expect(createdUser).toEqual({
        id: expect.any(String),
        email: 'test@example.com',
        userType: expect.objectContaining({
          id: testUserTypeId,
          name: 'Visitor',
        }),
      })

      const userInDb = await db('users').where({ id: createdUser.id }).first()
      expect(userInDb).toBeDefined()
      expect(userInDb.email).toBe('test@example.com')
      expect(userInDb.type_user_id).toBe(testUserTypeId)

      expect(userInDb.password).not.toBe('Alexa123')

      const isValidPassword = await verifyPassword(
        userInDb.password,
        'Alexa123'
      )
      expect(isValidPassword).toBe(true)
    })
  })

  describe('when the email already exists', () => {
    it('throws an error', async () => {
      const createUserParams: CreateUserParams = {
        email: 'duplicate@example.com',
        password: 'Password123',
        type_user_id: testUserTypeId,
      }

      await createUser(createUserParams)

      await expect(createUser(createUserParams)).rejects.toThrow(
        'Email already exists'
      )
    })
  })

  describe('when the user type does not exist', () => {
    it('throws an error', async () => {
      const createUserParams: CreateUserParams = {
        email: 'test@example.com',
        password: 'Password123',
        type_user_id: '00000000-0000-0000-0000-000000000000',
      }

      await expect(createUser(createUserParams)).rejects.toThrow()
    })
  })
})
