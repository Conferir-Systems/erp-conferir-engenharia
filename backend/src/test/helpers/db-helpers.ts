import { db } from '../../database/db'
import type { Work } from '../../models/works/works'
import type { UserDatabaseRow } from '../../models/users/users'

/**
 * Database Test Helpers
 *
 * These functions help create test data in the database
 */

/**
 * Create a test work in the database
 */
export async function createTestWork(overrides?: Partial<Work>): Promise<Work> {
  const defaultWork: Work = {
    id: crypto.randomUUID(),
    name: 'Test Work',
    code: 'TEST-001',
    address: 'Test Address, 123',
    contractor: 'Test Contractor',
    status: 'ATIVA',
    ...overrides,
  }

  await db('works').insert(defaultWork)
  return defaultWork
}

/**
 * Create multiple test works in the database
 */
export async function createTestWorks(count: number): Promise<Work[]> {
  const works: Work[] = []

  for (let i = 1; i <= count; i++) {
    const work = await createTestWork({
      name: `Test Work ${i}`,
      code: `TEST-${String(i).padStart(3, '0')}`,
      address: `Test Address ${i}`,
    })
    works.push(work)
  }

  return works
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
  overrides?: Partial<UserDatabaseRow>
): Promise<UserDatabaseRow> {
  // First, ensure there's a user_type
  const typeUserExists = await db('user_types').where({ id: 1 }).first()
  if (!typeUserExists) {
    await db('user_types').insert({
      id: 1,
      name: 'Admin',
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  const defaultUser: UserDatabaseRow = {
    id: crypto.randomUUID(),
    email: 'test@example.com',
    password: 'hashed_password',
    type_user_id: '1',
    ...overrides,
  }

  await db('users').insert(defaultUser)
  return defaultUser
}

/**
 * Clean all tables (useful for test cleanup)
 */
export async function cleanDatabase(): Promise<void> {
  // Delete in reverse order to respect foreign key constraints
  await db('works').del()
  await db('users').del()
  await db('user_types').del()
}

/**
 * Get all works from database
 */
export async function getAllWorks(): Promise<Work[]> {
  return db('works').select('*')
}

/**
 * Get work by id
 */
export async function getWorkById(id: string): Promise<Work | null> {
  return db('works').where({ id }).first()
}
