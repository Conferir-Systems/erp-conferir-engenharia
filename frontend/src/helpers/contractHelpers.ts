import { ContractResponse } from '../pages/services/contracts'
import { ContractData } from '../types/contractPdf'
import { formatDocument } from '../utils/formatters'

export const prepareContractData = (
  contract: ContractResponse
): ContractData => {
  if (!contract.supplier) {
    throw new Error('Supplier data is missing')
  }

  return {
    issueDate: new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    contractor: {
      name: 'CONFERIR ENGENHARIA LTDA',
      cnpj: '15.277.959/0001-46',
      address: 'Av. João Wallig, n° 904, sala 302, Porto Alegre-RS',
      representative: 'JUAN MARCEL LANGER MARTINS',
      cpfRepresentative: '022.454.700-36',
    },
    supplier: {
      name: contract.supplier.name || '',
      document: contract.supplier.document
        ? formatDocument(contract.supplier.document)
        : '',
      typePerson: contract.supplier.typePerson,
    },
    serviceDescription: contract.service,
    workName: contract.work?.name || '',
    totalValue: contract.totalValue,
    startDate: new Date(contract.startDate).toLocaleDateString('pt-BR'),
    deliveryTime: obtainDeliveryTime(
      new Date(contract.startDate),
      new Date(contract.deliveryTime)
    ),
    items: contract.items.map((item) => ({
      id: item.id,
      description: item.description,
      unitMeasure: item.unitMeasure,
      quantity: item.quantity,
      unitLaborValue: item.unitLaborValue,
      total: item.totalValue,
    })),
  }
}

export function obtainDeliveryTime(start: Date, expiration: Date): number {
  const startDateMs = start.getTime()
  const endDateMs = expiration.getTime()

  const differenceMs = Math.abs(endDateMs - startDateMs)

  const millisecondsPerDay = 1000 * 60 * 60 * 24
  const daysDifference = Math.floor(differenceMs / millisecondsPerDay)

  return daysDifference
}
