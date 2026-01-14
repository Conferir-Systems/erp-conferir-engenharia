import { MeasurementItem } from "./measurementItem"

export type Measurement = {
    id: string
    contractId: string
    issueDate: Date
    totalGrossValue: number
    retentionValue: number
    totalNetValue: number
    approvalDate: Date | null
    status: 'PENDING' | 'APPROVED' | 'REJECT'
    notes?: string
    createdAt?: Date
    updatedAt?: Date
}

export type CreateMeasurementParams = {
    contractId: string
    issueDate: string
    notes: string
    items: Omit<MeasurementItem, 'id' | 'measurementId' | 'created_at' | 'updated_at'>[]
}