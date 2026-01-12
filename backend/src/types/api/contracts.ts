import { Work } from '../works'
import { Supplier } from '../supplier'
import { ContractItem } from '../contractItems'

export type CreateContractRequest = {
  service: string
  startDate: Date
  deliveryDate: Date
}

export type ContractResponse = {
  id: string
  work: Work | null
  supplier: Supplier | null
  service: string
  totalValue: number
  startDate: Date
  deliveryTime: Date
  status: 'Ativo' | 'Encerrado'
  items: ContractItem[]
}
