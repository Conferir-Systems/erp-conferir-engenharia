export type ContractItem = {
  id: string
  contractId: string
  unitMeasure: string
  quantity: number
  unitLaborValue: number
  totalValue: number
  description: string
  createdAt?: Date
  updatedAt?: Date
}

export type ContractListItem = {
  id: string
  work: { id: string; name: string }
  supplier: { id: string; name: string }
  service: string
  totalValue: number
  startDate: Date
  deliveryTime: Date | null
  status: 'Ativo' | 'Encerrado'
  percentage: number
}

export type ContractQueryRow = {
  id: string
  service: string
  total_value: number
  start_date: Date
  delivery_time: Date | null
  status: 'Ativo' | 'Encerrado'
  work_id: string
  work_name: string
  supplier_id: string
  supplier_name: string
}
