import { describe, it, expect, beforeEach } from 'vitest'
import { contractService } from '../instances'
import type { CreateContractParams } from '../Contract'
import {
  createTestWork,
  createTestSupplier,
  cleanDatabase,
} from '../../test-helpers/db-helpers'
import { supplierService, workService } from '../instances'
import { randomUUID } from 'crypto'
import type { Work } from '../../types/works'
import type { SupplierDatabaseRow } from '../../types/database'

describe('Contract - integration crud test', () => {
  let testWork: Work
  let testSupplier: SupplierDatabaseRow

  beforeEach(async () => {
    await cleanDatabase()
    testWork = await createTestWork()
    testSupplier = await createTestSupplier()
  })

  describe('when creating a new contract', () => {
    it('create a new contract', async () => {
      const startDate = new Date('2024-01-01')
      const deliveryDate = new Date('2024-12-31')

      const createContractParams: CreateContractParams = {
        workId: testWork.id,
        supplierId: testSupplier.id,
        service: 'Colocação de tijolos refratários em churrasqueiras',
        totalValue: 100000.0,
        startDate,
        deliveryDate,
      }

      const createdContract =
        await contractService.createContract(createContractParams)

      expect(createdContract).toEqual({
        id: expect.any(String),
        work: await workService.getWorkById(createContractParams.workId),
        supplier: await supplierService.getSupplierById(
          createContractParams.supplierId
        ),
        service: 'Colocação de tijolos refratários em churrasqueiras',
        totalValue: 100000.0,
        startDate: expect.any(Date),
        deliveryTime: expect.any(Date),
      })
    })
  })

  describe('when getting a contract', () => {
    it('should return a contract by id', async () => {
      const createContractParams: CreateContractParams = {
        workId: testWork.id,
        supplierId: testSupplier.id,
        service: 'Test Service',
        totalValue: 10000.0,
        startDate: new Date('2024-01-01'),
      }

      const createdContract =
        await contractService.createContract(createContractParams)
      const contract = await contractService.getContract(createdContract.id)

      expect(contract).toEqual({
        id: createdContract.id,
        workId: testWork.id,
        supplierId: testSupplier.id,
        service: 'Test Service',
        totalValue: '10000.0000',
        startDate: expect.any(Date),
        deliveryTime: null,
      })
    })

    it('should return null for non-existent contract', async () => {
      const nonExistentId = randomUUID()
      const contract = await contractService.getContract(nonExistentId)
      expect(contract).toBeNull()
    })
  })

  describe('when getting all contracts', () => {
    it('should return all contracts', async () => {
      const contract1Params: CreateContractParams = {
        workId: testWork.id,
        supplierId: testSupplier.id,
        service: 'Colocação de tijolos refratários',
        totalValue: 100000.0,
        startDate: new Date('2024-01-01'),
      }

      const contract2Params: CreateContractParams = {
        workId: testWork.id,
        supplierId: testSupplier.id,
        service: 'Instalação de janelas',
        totalValue: 50000.0,
        startDate: new Date('2024-02-01'),
      }

      const contract3Params: CreateContractParams = {
        workId: testWork.id,
        supplierId: testSupplier.id,
        service: 'Pintura externa',
        totalValue: 25000.0,
        startDate: new Date('2024-03-01'),
      }

      const contract1 = await contractService.createContract(contract1Params)
      const contract2 = await contractService.createContract(contract2Params)
      const contract3 = await contractService.createContract(contract3Params)

      const contracts = await contractService.getContracts()

      expect(contracts).toHaveLength(3)
      expect(contracts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: contract1.id,
            service: 'Colocação de tijolos refratários',
            totalValue: '100000.0000',
          }),
          expect.objectContaining({
            id: contract2.id,
            service: 'Instalação de janelas',
            totalValue: '50000.0000',
          }),
          expect.objectContaining({
            id: contract3.id,
            service: 'Pintura externa',
            totalValue: '25000.0000',
          }),
        ])
      )
    })

    it('should return empty array when no contracts exist', async () => {
      const contracts = await contractService.getContracts()

      expect(contracts).toEqual([])
    })
  })
})
