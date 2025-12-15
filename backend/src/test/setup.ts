import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { db } from '../database/db'

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run with NODE_ENV=test')
  }

  try {
    await db.migrate.latest()
    console.log('✅ Test database migrations completed')
  } catch (error) {
    console.error('❌ Failed to run migrations:', error)
    throw error
  }
})

beforeEach(async () => {
  // Start a transaction before each test
  // This allows us to rollback after each test for isolation
})

afterEach(async () => {
  // Clean up all tables after each test to ensure isolation
  // Delete in reverse order to respect foreign key constraints
  const tables = ['works', 'users', 'user_types']

  for (const table of tables) {
    try {
      await db(table).del()
    } catch (error) {
      // Ignore "relation does not exist" errors (table might not be used in this test)
      if (error instanceof Error && !error.message.includes('does not exist')) {
        console.error(`Failed to clean table ${table}:`, error)
        throw error
      }
    }
  }
})

afterAll(async () => {
  // Rollback migrations (optional - comment out if you want to keep the schema)
  // await db.migrate.rollback(undefined, true)

  await db.destroy()
  console.log('✅ Test database connection closed')
})
