# Testing Guide

This document describes how to set up and run integration tests with a real database.

## Table of Contents

- [Testing Architecture](#testing-architecture)
- [Initial Setup](#initial-setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Helpers](#test-helpers)
- [Troubleshooting](#troubleshooting)

## Testing Architecture

### Databases

The project uses **a single PostgreSQL container** with **two databases**:

- **conf** (port 5432) - Development database
- **conf_test** (port 5432) - Test database

Both run in the same PostgreSQL container, but are completely isolated.

### File Structure

```
backend/
├── src/
│   ├── test/
│   │   ├── setup.ts              # Global test configuration
│   │   └── helpers/
│   │       ├── db-helpers.ts     # Helper functions for tests
│   │       └── index.ts
│   ├── services/
│   │   └── __test__/
│   │       └── works/
│   │           └── createWork.integration.test.ts
│   └── database/
│       ├── db.ts                 # Database connection (changes per environment)
│       ├── knexfile.ts           # Environment configurations
│       └── migrations/           # Migrations (shared)
└── vitest.config.ts              # Vitest configuration
```

## Initial Setup

### 1. Environment Variables

Make sure your `.env` file contains:

```bash
# Development Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=conf

# Test Database (same container, different database)
DB_TEST_HOST=localhost
DB_TEST_PORT=5432
DB_TEST_USER=postgres
DB_TEST_PASSWORD=postgres
DB_TEST_NAME=conf_test
```

### 2. Run Migrations on Test Database

```bash
cd backend
npm run db:test:setup
```

This will execute all migrations on the `conf_test` database.

## Running Tests

### Available Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs when saving files)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Reset Test Database

If you need to reset the test database:

```bash
# Rollback all migrations and re-run
npm run db:test:reset
```

## Writing Tests

### Example: Integration Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createWork } from '../../works/works'
import { cleanDatabase, getWorkById } from '../../../test/helpers'

describe('createWork - Integration Tests', () => {
  beforeEach(async () => {
    await cleanDatabase()
  })

  it('should create work with all required fields', async () => {
    const params = {
      name: 'Test Work',
      address: 'Test Street, 123',
      code: 'OB-001',
      contractor: 'Test Contractor',
      status: 'ATIVA',
    }

    const result = await createWork(params)

    expect(result).toMatchObject(params)

    const savedWork = await getWorkById(result.id)
    expect(savedWork).toMatchObject(params)
  })
})
```

### Best Practices

1. **Test Isolation**
   - Use `beforeEach` to clean the database before each test
   - Don't depend on test execution order

2. **Naming**
   - Use `.integration.test.ts` for tests that use the database
   - Use `.test.ts` or `.spec.ts` for unit tests (with mocks)

3. **Assertions**
   - Verify not only the function return, but also the database state
   - Use `getWorkById()` or similar helpers to confirm persistence

4. **Performance**
   - Avoid creating unnecessary data
   - Use `cleanDatabase()` instead of deleting manually

## Test Helpers

Located in `backend/src/test/helpers/db-helpers.ts`:

### `createTestWork(overrides?: Partial<Work>)`

Creates a test work in the database:

```typescript
const work = await createTestWork({
  name: 'My Work',
  code: 'OB-123',
})
```

### `createTestWorks(count: number)`

Creates multiple test works:

```typescript
const works = await createTestWorks(5) 
```

### `createTestUser(overrides?: Partial<User>)`

Creates a test user:

```typescript
const user = await createTestUser({
  name: 'John Doe',
  email: 'john@example.com',
})
```

### `cleanDatabase()`

Cleans all tables:

```typescript
await cleanDatabase() 
```

### `getWorkById(id: string)`

Fetches work directly from the database:

```typescript
const work = await getWorkById('some-uuid')
```

### `getAllWorks()`

Returns all works from the database:

```typescript
const works = await getAllWorks()
expect(works).toHaveLength(3)
```

## Troubleshooting

### Error: "Work not found" in tests

**Cause**: Test database doesn't have migrations applied.

**Solution**:
```bash
npm run db:test:setup
```

### Error: "Connection refused" on PostgreSQL

**Cause**: Container is not running or not healthy.

**Solution**:
```bash
docker compose ps
docker compose up -d conf-postgres
```

### Tests pass locally but fail in CI/CD

**Cause**: Different environment variables or database not configured.

**Solution**:
- Check environment variables in CI
- Add step to create test database
- Run migrations before tests

### Error: "Database conf_test does not exist"

**Cause**: Test database was not created.

**Solution**:
```bash
docker exec -i conf-postgres psql -U postgres -d postgres <<-EOSQL
    CREATE DATABASE conf_test;
EOSQL

npm run db:test:setup
```

### Tests are too slow

**Possible causes**:
- Too much data being created
- Inefficient database cleanup
- Database connections not being reused

**Solutions**:
- Use `cleanDatabase()` instead of creating/deleting manually
- Create only the necessary data for each test
- Check the connection pool in knexfile.ts