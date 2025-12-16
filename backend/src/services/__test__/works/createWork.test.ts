import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WorkService } from '../../works/works'
import { workRepository } from '../../../repository/works/works'
import type { CreateWorkRequest, Work } from '../../../types/works/works'

vi.mock('../../../repository/works/works', () => ({
  workRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('createWork', () => {
  let workService: WorkService

  beforeEach(() => {
    vi.clearAllMocks()
    workService = new WorkService(workRepository)
  })

  describe('when work is created successfully', () => {
    it('should create work with all required fields', async () => {
      const params: CreateWorkRequest = {
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
        code: 'OB-001',
        contractor: 'Construtora Teste',
        status: 'ATIVA',
      }

      const mockCreatedWork: Work = {
        id: expect.any(String),
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
        code: 'OB-001',
        contractor: 'Construtora Teste',
        status: 'ATIVA',
      }

      vi.mocked(workRepository.create).mockResolvedValue(undefined)
      vi.mocked(workRepository.findById).mockResolvedValue(mockCreatedWork)

      const result = await workService.createWork(params)

      expect(workRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Obra Teste',
          address: 'Rua Teste, 123',
          code: 'OB-001',
          contractor: 'Construtora Teste',
          status: 'ATIVA',
        })
      )
      expect(workRepository.findById).toHaveBeenCalledWith(expect.any(String))
      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
        code: 'OB-001',
        contractor: 'Construtora Teste',
        status: 'ATIVA',
      })
    })

    it('should use default status ATIVA when not provided', async () => {
      const params: CreateWorkRequest = {
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
      }

      const mockCreatedWork: Work = {
        id: expect.any(String),
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
        code: null,
        contractor: null,
        status: 'ATIVA',
      }

      vi.mocked(workRepository.create).mockResolvedValue(undefined)
      vi.mocked(workRepository.findById).mockResolvedValue(mockCreatedWork)

      const result = await workService.createWork(params)

      expect(result.status).toBe('ATIVA')
      expect(workRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ATIVA',
        })
      )
    })

    it('should handle optional fields as null', async () => {
      const params: CreateWorkRequest = {
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
      }

      const mockCreatedWork: Work = {
        id: expect.any(String),
        name: 'Obra Teste',
        address: 'Rua Teste, 123',
        code: null,
        contractor: null,
        status: 'ATIVA',
      }

      vi.mocked(workRepository.create).mockResolvedValue(undefined)
      vi.mocked(workRepository.findById).mockResolvedValue(mockCreatedWork)

      const result = await workService.createWork(params)

      expect(result.code).toBeNull()
      expect(result.contractor).toBeNull()
      expect(workRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          code: null,
          contractor: null,
        })
      )
    })
  })
})
