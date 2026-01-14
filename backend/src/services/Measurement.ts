import { randomUUID } from 'crypto'
import { Measurement } from '../types/measurements.js'
import { MeasurementItem  } from '../types/measurementItem.js' 
import { IMeasurementRepository } from '../repository/measurements.js'
import { IMeasurementItemRepository } from '../repository/measurementItems.js
import { CreateMeasurementParams } from '../types/measurements.js'
import { IContractRepository } from '../repository/contracts.js'
import { IContractItemRepository } from '../repository/contractItems.js'

export class MeasurementService {
    constructor(
        private measurementRepo: IMeasurementRepository,
        private measurementItemRepo: IMeasurementItemRepository,
        private contractRepo: IContractRepository,
        private contractItemRepo: IContractItemRepository
    ) {}

    async createMeasurementWithItems(
        params: CreateMeasurementParams
    ): Promise<Measurement> {
        const measurementId = randomUUID()

        const contract = await this.contractRepo.findById(params.contractId)
        const retentionPercentage = contract?.retentionPercentage || 0

         const measurementItems: MeasurementItem[] = params.items.map((item: MeasurementItem) => ({
            id: randomUUID(),
            measurementId,
            contractItemId: item.contractItemId,
            quantity: item.quantity,
            unitLaborValue: item.unitLaborValue,
            totalGrossValue: item.quantity * item.unitLaborValue,
        }))

        const totalGrossValue = measurementItems.reduce(
            (sum, item) => sum + item.totalGrossValue,
            0
        ) 

        const retentionValue = totalGrossValue * (retentionPercentage / 100)

        const totalNetValue = totalGrossValue - retentionValue
    }
}
