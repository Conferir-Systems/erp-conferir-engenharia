import type {
  Contract,
  CreateContractInputRepository,
} from '../types/contracts.js'
import type { ContractDatabaseRow } from '../types/database.js'
import type {
  ContractItem,
  ContractListItem,
  ContractQueryRow,
} from '../types/contractItems.js'
import { BaseRepository } from './BaseRepository.js'
import { contractItemRepository } from './contractItems.js'
import { ValidationError } from '../errors/ValidationError.js'

export interface IContractRepository {
  create(contract: Contract): Promise<void>
  createContractWithItems(
    data: CreateContractInputRepository
  ): Promise<{ contract: Contract; items: ContractItem[] }>
  findAllWithFilters(filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]>
  findById(id: string): Promise<Contract | null>
  findAll(): Promise<Contract[] | null>
}

class ContractRepository
  extends BaseRepository<Contract, ContractDatabaseRow>
  implements IContractRepository
{
  constructor() {
    super('contracts')
  }

  async createContractWithItems(
    data: CreateContractInputRepository
  ): Promise<{ contract: Contract; items: ContractItem[] }> {
    const contract: Contract = {
      id: data.id,
      workId: data.work,
      supplierId: data.supplier,
      service: data.service,
      totalValue: data.totalValue,
      startDate: new Date(data.start_date),
      deliveryTime: data.delivery_time ? new Date(data.delivery_time) : null,
      status: 'Ativo',
    }

    const contractItems: ContractItem[] = data.items

    if (contractItems.length === 0) {
      throw new ValidationError('Minimal one item per contract')
    }

    await this.db.transaction(async (trx) => {
      await trx(this.tableName).insert(this.toDatabase(contract))

      const itemsToInsert = contractItems.map((item) =>
        contractItemRepository['toDatabase'](item)
      )
      await trx('contract_items').insert(itemsToInsert)
    })

    return { contract, items: contractItems }
  }

  async findAllWithFilters(filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]> {
    let query = this.db('contracts')
      .select<
        ContractQueryRow[]
      >('contracts.id', 'contracts.service', 'contracts.total_value', 'contracts.start_date', 'contracts.delivery_time', 'contracts.status', 'works.id as work_id', 'works.name as work_name', 'suppliers.id as supplier_id', 'suppliers.name as supplier_name')
      .leftJoin('works', 'contracts.work', 'works.id')
      .leftJoin('suppliers', 'contracts.supplier', 'suppliers.id')

    if (filters?.workId) {
      query = query.where('contracts.work', filters.workId)
    }

    if (filters?.supplierId) {
      query = query.where('contracts.supplier', filters.supplierId)
    }

    const rows = await query

    return rows.map((row: ContractQueryRow) => ({
      id: row.id,
      work: { id: row.work_id, name: row.work_name },
      supplier: { id: row.supplier_id, name: row.supplier_name },
      service: row.service,
      totalValue: row.total_value,
      startDate: row.start_date,
      deliveryTime: row.delivery_time,
      status: row.status,
      percentage: 0,
    }))
  }

  protected toDomain(row: ContractDatabaseRow): Contract {
    return {
      id: row.id,
      workId: row.work,
      supplierId: row.supplier,
      service: row.service,
      totalValue: row.total_value,
      startDate: row.start_date,
      deliveryTime: row.delivery_time,
      status: row.status,
    }
  }

  protected toDatabase(data: Contract): ContractDatabaseRow {
    return {
      id: data.id,
      work: data.workId,
      supplier: data.supplierId,
      service: data.service,
      total_value: data.totalValue,
      start_date: data.startDate,
      delivery_time: data.deliveryTime ?? null,
      status: data.status,
      created_at: data.createdAt ?? new Date(),
      updated_at: data.updatedAt ?? new Date(),
    }
  }
}

export const contractRepository = new ContractRepository()
