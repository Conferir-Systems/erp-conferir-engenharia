import { describe, it, expect } from 'vitest'
import { createUser, CreateUserParams } from '../createUser'

describe('create user', () => {
  const createUserParams: CreateUserParams = {
    email: 'alexandre@mail.com',
    password: 'Alexa123',
  }

  describe('when the user doesnt not exists', () => {
    it('returns an user', async () => {
      const createdUser = await createUser(createUserParams)

      expect(createdUser).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: createUserParams.email,
          passwordHash: expect.any(String),
        })
      )
    })
  })
})
