# Contract Auto-Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automatically mark contracts as 'Concluido' when all items are fully measured, and prevent new measurements on completed contracts.

**Architecture:** Add validation in MeasurementService to check contract status before creating measurements. After creating a measurement, check if all contract items are fully measured and update contract status to 'Concluido'. Add updateStatus method to ContractRepository.

**Tech Stack:** TypeScript, Express, Knex (PostgreSQL), Vitest

---

## Task 1: Add updateStatus method to ContractRepository

**Files:**
- Modify: [repository/contracts.ts](src/repository/contracts.ts:14-24) (interface)
- Modify: [repository/contracts.ts](src/repository/contracts.ts:26-132) (implementation)

**Step 1: Write the failing test**

Create file: `src/repository/__tests__/contracts.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { contractRepository } from '../contracts'
import { db } from '../../database/db'
import {
	createTestWork,
	createTestSupplier,
	cleanDatabase,
} from '../../test-helpers/db-helpers'
import { randomUUID } from 'crypto'

describe('ContractRepository', () => {
	beforeEach(async () => {
		await cleanDatabase()
	})

	describe('updateStatus', () => {
		it('should update contract status to Concluido', async () => {
			const work = await createTestWork()
			const supplier = await createTestSupplier()

			const contractId = randomUUID()
			const contractItemId = randomUUID()

			await db('contracts').insert({
				id: contractId,
				work_id: work.id,
				supplier_id: supplier.id,
				service: 'Test Service',
				total_value: 10000,
				retention_percentage: 5,
				start_date: new Date('2024-01-01'),
				delivery_time: new Date('2024-12-31'),
				status: 'Ativo',
				created_at: new Date(),
				updated_at: new Date(),
			})

			await db('contract_items').insert({
				id: contractItemId,
				contract_id: contractId,
				unit_measure: 'm2',
				quantity: 100,
				unit_labor_value: 100,
				total_value: 10000,
				description: 'Test Item',
				created_at: new Date(),
				updated_at: new Date(),
			})

			await contractRepository.updateStatus(contractId, 'Concluido')

			const updated = await contractRepository.findById(contractId)
			expect(updated?.status).toBe('Concluido')
		})
	})
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/repository/__tests__/contracts.test.ts`
Expected: FAIL with "updateStatus is not a function" or similar

**Step 3: Add interface method**

In `src/repository/contracts.ts`, add to `IContractRepository` interface:

```typescript
export interface IContractRepository {
	createContractWithItems(
		data: CreateContractInputRepository
	): Promise<{ contract: Contract; items: ContractItem[] }>
	findAllWithFilters(filters?: {
		workId?: string
		supplierId?: string
	}): Promise<ContractListItem[]>
	findById(id: string): Promise<Contract | null>
	findAll(): Promise<Contract[] | null>
	updateStatus(id: string, status: ContractStatus): Promise<void>
}
```

**Step 4: Import ContractStatus type**

Update imports in `src/repository/contracts.ts`:

```typescript
import type {
	Contract,
	CreateContractInputRepository,
	ContractStatus,
} from '../types/contracts.js'
```

**Step 5: Implement updateStatus method**

Add to `ContractRepository` class before `protected toDomain`:

```typescript
async updateStatus(id: string, status: ContractStatus): Promise<void> {
	await this.db(this.tableName)
		.where('id', id)
		.update({ status, updated_at: new Date() })
}
```

**Step 6: Run test to verify it passes**

Run: `npm test -- src/repository/__tests__/contracts.test.ts`
Expected: PASS

**Step 7: Commit**

```bash
git add src/repository/contracts.ts src/repository/__tests__/contracts.test.ts
git commit -m "$(cat <<'EOF'
feat: add updateStatus method to ContractRepository

Enables changing contract status programmatically for auto-completion feature.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add validation to prevent measurements on completed contracts

**Files:**
- Modify: [services/Measurement.ts](src/services/Measurement.ts:111-182)

**Step 1: Write the failing test**

Create file: `src/services/__tests__/Measurement.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { measurementService, contractService } from '../instances'
import {
	createTestWork,
	createTestSupplier,
	cleanDatabase,
} from '../../test-helpers/db-helpers'
import { db } from '../../database/db'
import { randomUUID } from 'crypto'

describe('MeasurementService', () => {
	beforeEach(async () => {
		await cleanDatabase()
	})

	describe('createMeasurementWithItems', () => {
		it('should throw error when contract status is Concluido', async () => {
			const work = await createTestWork()
			const supplier = await createTestSupplier()

			const contract = await contractService.createContractWithItems({
				workId: work.id,
				supplierId: supplier.id,
				service: 'Test Service',
				retentionPercentage: 5,
				startDate: '2024-01-01',
				deliveryTime: '2024-12-31',
				items: [
					{
						unitMeasure: 'm2',
						quantity: 100,
						unitLaborValue: 100,
						description: 'Test Item',
					},
				],
			})

			// Manually set contract to Concluido
			await db('contracts')
				.where('id', contract.id)
				.update({ status: 'Concluido' })

			const contractItems = await db('contract_items')
				.where('contract_id', contract.id)
				.select('id')

			await expect(
				measurementService.createMeasurementWithItems({
					contractId: contract.id,
					items: [
						{
							contractItemId: contractItems[0].id,
							quantity: 10,
						},
					],
				})
			).rejects.toThrow('Não é possível criar medições para contratos concluídos')
		})
	})
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/services/__tests__/Measurement.test.ts`
Expected: FAIL - measurement is created instead of throwing error

**Step 3: Add validation in createMeasurementWithItems**

In `src/services/Measurement.ts`, add validation after fetching contract (around line 121):

```typescript
async createMeasurementWithItems(
	params: MeasurementParams
): Promise<{ measurement: Measurement; items: MeasurementItem[] }> {
	const measurementId = randomUUID()
	const contractWithoutRetentionPercentage = 0
	const measurementIssueDate = new Date()

	const contract = await this.contractRepo.findById(params.contractId)
	if (!contract) {
		throw new NotFoundError(`Contract with id ${params.contractId} not found`)
	}

	if (contract.status === 'Concluido') {
		throw new ValidationError(
			'Não é possível criar medições para contratos concluídos'
		)
	}

	// ... rest of method unchanged
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/services/__tests__/Measurement.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/services/Measurement.ts src/services/__tests__/Measurement.test.ts
git commit -m "$(cat <<'EOF'
feat: prevent measurements on completed contracts

Throws ValidationError when attempting to create measurement for a contract
with status 'Concluido'.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Auto-complete contract when all items are fully measured

**Files:**
- Modify: [services/Measurement.ts](src/services/Measurement.ts:111-182)

**Step 1: Write the failing test**

Add to `src/services/__tests__/Measurement.test.ts`:

```typescript
it('should mark contract as Concluido when all items are fully measured', async () => {
	const work = await createTestWork()
	const supplier = await createTestSupplier()

	const contract = await contractService.createContractWithItems({
		workId: work.id,
		supplierId: supplier.id,
		service: 'Test Service',
		retentionPercentage: 5,
		startDate: '2024-01-01',
		deliveryTime: '2024-12-31',
		items: [
			{
				unitMeasure: 'm2',
				quantity: 100,
				unitLaborValue: 100,
				description: 'Test Item',
			},
		],
	})

	const contractItems = await db('contract_items')
		.where('contract_id', contract.id)
		.select('id')

	// Measure the full quantity
	await measurementService.createMeasurementWithItems({
		contractId: contract.id,
		items: [
			{
				contractItemId: contractItems[0].id,
				quantity: 100,
			},
		],
	})

	const updatedContract = await contractService.getContractInfo(contract.id)
	expect(updatedContract?.status).toBe('Concluido')
})

it('should NOT mark contract as Concluido when items are partially measured', async () => {
	const work = await createTestWork()
	const supplier = await createTestSupplier()

	const contract = await contractService.createContractWithItems({
		workId: work.id,
		supplierId: supplier.id,
		service: 'Test Service',
		retentionPercentage: 5,
		startDate: '2024-01-01',
		deliveryTime: '2024-12-31',
		items: [
			{
				unitMeasure: 'm2',
				quantity: 100,
				unitLaborValue: 100,
				description: 'Test Item',
			},
		],
	})

	const contractItems = await db('contract_items')
		.where('contract_id', contract.id)
		.select('id')

	// Measure only partial quantity
	await measurementService.createMeasurementWithItems({
		contractId: contract.id,
		items: [
			{
				contractItemId: contractItems[0].id,
				quantity: 50,
			},
		],
	})

	const updatedContract = await contractService.getContractInfo(contract.id)
	expect(updatedContract?.status).toBe('Ativo')
})

it('should mark contract as Concluido after multiple measurements complete all items', async () => {
	const work = await createTestWork()
	const supplier = await createTestSupplier()

	const contract = await contractService.createContractWithItems({
		workId: work.id,
		supplierId: supplier.id,
		service: 'Test Service',
		retentionPercentage: 5,
		startDate: '2024-01-01',
		deliveryTime: '2024-12-31',
		items: [
			{
				unitMeasure: 'm2',
				quantity: 100,
				unitLaborValue: 100,
				description: 'Item 1',
			},
			{
				unitMeasure: 'kg',
				quantity: 50,
				unitLaborValue: 200,
				description: 'Item 2',
			},
		],
	})

	const contractItems = await db('contract_items')
		.where('contract_id', contract.id)
		.select('id', 'quantity')
		.orderBy('description')

	// First measurement - partial
	await measurementService.createMeasurementWithItems({
		contractId: contract.id,
		items: [
			{ contractItemId: contractItems[0].id, quantity: 50 },
			{ contractItemId: contractItems[1].id, quantity: 25 },
		],
	})

	let updatedContract = await contractService.getContractInfo(contract.id)
	expect(updatedContract?.status).toBe('Ativo')

	// Second measurement - complete all
	await measurementService.createMeasurementWithItems({
		contractId: contract.id,
		items: [
			{ contractItemId: contractItems[0].id, quantity: 50 },
			{ contractItemId: contractItems[1].id, quantity: 25 },
		],
	})

	updatedContract = await contractService.getContractInfo(contract.id)
	expect(updatedContract?.status).toBe('Concluido')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/services/__tests__/Measurement.test.ts`
Expected: FAIL - contract status remains 'Ativo'

**Step 3: Add private method to check if contract is fully measured**

In `src/services/Measurement.ts`, add private method:

```typescript
private async isContractFullyMeasured(contractId: string): Promise<boolean> {
	const contractItems = await this.contractItemRepo.findByContractId(contractId)
	const measurementItems = await this.measurementItemRepo.findByContractId(contractId)

	const measuredQuantitiesByItem = new Map<string, number>()
	for (const item of measurementItems) {
		const current = measuredQuantitiesByItem.get(item.contractItemId) || 0
		measuredQuantitiesByItem.set(item.contractItemId, current + item.quantity)
	}

	for (const contractItem of contractItems) {
		const measuredQuantity = measuredQuantitiesByItem.get(contractItem.id) || 0
		if (measuredQuantity < contractItem.quantity) {
			return false
		}
	}

	return true
}
```

**Step 4: Update createMeasurementWithItems to auto-complete contract**

At the end of `createMeasurementWithItems`, before the return statement:

```typescript
// Check if contract should be marked as completed
const isFullyMeasured = await this.isContractFullyMeasured(params.contractId)
if (isFullyMeasured) {
	await this.contractRepo.updateStatus(params.contractId, 'Concluido')
}

return createdMeasurement
```

**Step 5: Run test to verify it passes**

Run: `npm test -- src/services/__tests__/Measurement.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/services/Measurement.ts src/services/__tests__/Measurement.test.ts
git commit -m "$(cat <<'EOF'
feat: auto-complete contracts when fully measured

After creating a measurement, checks if all contract items have been fully
measured. If so, automatically updates contract status to 'Concluido'.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Update test helpers to clean measurement tables

**Files:**
- Modify: [test-helpers/db-helpers.ts](src/test-helpers/db-helpers.ts:80-87)

**Step 1: Update cleanDatabase function**

In `src/test-helpers/db-helpers.ts`, update `cleanDatabase`:

```typescript
export async function cleanDatabase(): Promise<void> {
	await db('measurement_items').del()
	await db('measurements').del()
	await db('contract_items').del()
	await db('contracts').del()
	await db('users').del()
	await db('suppliers').del()
	await db('works').del()
	await db('user_types').del()
}
```

**Step 2: Run all tests**

Run: `npm test`
Expected: All tests PASS

**Step 3: Commit**

```bash
git add src/test-helpers/db-helpers.ts
git commit -m "$(cat <<'EOF'
fix: add measurement tables to cleanDatabase helper

Ensures measurement_items and measurements are cleaned before tests run.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Run full test suite and verify

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests PASS

**Step 2: Run type check**

Run: `npm run typecheck` or `npx tsc --noEmit`
Expected: No type errors

**Step 3: Final commit if any fixes needed**

---

## Summary

This implementation:
1. Adds `updateStatus` method to `ContractRepository` for changing contract status
2. Validates that completed contracts cannot receive new measurements
3. Automatically marks contracts as 'Concluido' when all items are fully measured
4. Uses TDD approach with comprehensive test coverage
5. Handles edge cases: partial measurements, multiple measurements, multiple items
