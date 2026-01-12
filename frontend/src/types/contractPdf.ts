export interface ItemData {
  id: string
  description: string
  unitMeasure: string
  quantity: number
  unitLaborValue: number
  total: number
}

export interface ContractData {
  issueDate: string

  contractor: {
    name: string
    cnpj?: string
    cpf?: string
    address: string
    representative?: string
    cpfRepresentative?: string
  }

  supplier: {
    name: string
    document: string
    typePerson: 'FISICA' | 'JURIDICA'
  }

  serviceDescription: string
  workName: string

  totalValue: number
  startDate: string
  deliveryTime: number

  items: ItemData[]
}
