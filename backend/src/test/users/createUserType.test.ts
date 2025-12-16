import { describe, it, expect } from 'vitest'
import {
  createUserType,
  CreateUserTypeParams,
} from '../../services/users/createUserType'
import { db } from '../../database/db'

describe('createUserType - Integration Tests', () => {
  describe('when creating a new user type', () => {
    it('creates a user type in the database', async () => {
      const createUserTypeParams: CreateUserTypeParams = {
        name: 'Admin',
      }

      const createdUserType = await createUserType(createUserTypeParams)

      expect(createdUserType).toEqual({
        id: expect.any(String),
        name: 'Admin',
      })

      const userTypeInDb = await db('user_types')
        .where({ id: createdUserType.id })
        .first()

      expect(userTypeInDb).toBeDefined()
      expect(userTypeInDb.name).toBe('Admin')
    })
  })

  describe('when the user type name already exists', () => {
    it('throws an error', async () => {
      const createUserTypeParams: CreateUserTypeParams = {
        name: 'Supervisor',
      }

      await createUserType(createUserTypeParams)

      await expect(createUserType(createUserTypeParams)).rejects.toThrow(
        'User type already exists'
      )
    })
  })
})
