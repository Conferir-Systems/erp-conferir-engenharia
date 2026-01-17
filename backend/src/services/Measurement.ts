import { randomUUID } from 'crypto'
import {
	Measurement,
	MeasurementParams,
	EnrichedMeasurement,
} from '../types/measurements.js'
import {
	MeasurementItem,
	MeasurementItemInputRepository,
} from '../types/measurementItems.js'
import type { UUID } from '../types/common.js'
import { IMeasurementRepository } from '../repository/measurements.js'
import { IContractRepository } from '../repository/contracts.js'
import { IContractItemRepository } from '../repository/contractItems.js'
import { IMeasurementItemRepository } from '../repository/measurementItems.js'
import { IWorkRepository } from '../repository/works.js'
import { ISupplierRepository } from '../repository/suppliers.js'
import { NotFoundError } from '../errors/NotFoundError.js'
import { ValidationError } from '../errors/ValidationError.js'
import { MeasurementWithItemsResponse } from '../types/api/measurements.js'

export class MeasurementService {
	constructor(
		private measurementRepo: IMeasurementRepository,
		private contractRepo: IContractRepository,
		private contractItemRepo: IContractItemRepository,
		private measurementItemRepo: IMeasurementItemRepository,
		private workRepo: IWorkRepository,
		private supplierRepo: ISupplierRepository
	) {}

	async getMeasurement(id: UUID): Promise<Measurement> {
		const measurement = await this.measurementRepo.findById(id)

		if (!measurement) {
			throw new NotFoundError(`Measurement with id ${id} not found`)
		}

		return measurement
	}

	async getMeasurementWithItems(
		id: UUID
	): Promise<MeasurementWithItemsResponse> {
		const measurement = await this.measurementRepo.findById(id)
		if (!measurement) throw new NotFoundError('Measurement not found')

		const items = await this.measurementItemRepo.findByMeasurementId(id)

		return {
			id: measurement.id,
			contractId: measurement.contractId,
			issueDate: measurement.issueDate,
			totalGrossValue: measurement.totalGrossValue,
			retentionValue: measurement.retentionValue,
			totalNetValue: measurement.totalNetValue,
			approvalDate: measurement.approvalDate || null,
			approvalStatus: measurement.approvalStatus,
			notes: measurement.notes,
			items,
		}
	}

	async getMeasurements(): Promise<Measurement[]> {
		const measurements = await this.measurementRepo.findAll()

		if (!measurements) return []

		return measurements
	}

	async getMeasurementsWithItems(): Promise<MeasurementWithItemsResponse[]> {
		const measurements = await this.measurementRepo.findAll()
		if (!measurements || measurements.length === 0) return []

		const measurementsWithItems = await Promise.all(
			measurements.map(async (measurement) => {
				const items = await this.measurementItemRepo.findByMeasurementId(
					measurement.id
				)
				return {
					id: measurement.id,
					contractId: measurement.contractId,
					issueDate: measurement.issueDate,
					totalGrossValue: measurement.totalGrossValue,
					retentionValue: measurement.retentionValue,
					totalNetValue: measurement.totalNetValue,
					approvalDate: measurement.approvalDate || null,
					approvalStatus: measurement.approvalStatus,
					notes: measurement.notes,
					items,
				}
			})
		)

		return measurementsWithItems
	}

	async getEnrichedMeasurements(): Promise<EnrichedMeasurement[]> {
		const measurements = await this.measurementRepo.findAll()
		if (!measurements || measurements.length === 0) return []

		const contractIds = [...new Set(measurements.map((m) => m.contractId))]

		const contracts = await Promise.all(
			contractIds.map((id) => this.contractRepo.findById(id))
		)
		const contractsMap = new Map(
			contracts.filter(Boolean).map((c) => [c!.id, c!])
		)

		const workIds = [
			...new Set(contracts.filter(Boolean).map((c) => c!.workId)),
		]
		const supplierIds = [
			...new Set(contracts.filter(Boolean).map((c) => c!.supplierId)),
		]

		const works = await Promise.all(
			workIds.map((id) => this.workRepo.findById(id))
		)
		const worksMap = new Map(works.filter(Boolean).map((w) => [w!.id, w!]))

		const suppliers = await Promise.all(
			supplierIds.map((id) => this.supplierRepo.findById(id))
		)
		const suppliersMap = new Map(
			suppliers.filter(Boolean).map((s) => [s!.id, s!])
		)

		return measurements
			.map((measurement) => {
				const contract = contractsMap.get(measurement.contractId)
				if (!contract) return null

				const work = worksMap.get(contract.workId)
				const supplier = suppliersMap.get(contract.supplierId)

				if (!work || !supplier) return null

				return {
					...measurement,
					contract: {
						id: contract.id,
						service: contract.service,
						workId: contract.workId,
						supplierId: contract.supplierId,
					},
					work: {
						id: work.id,
						name: work.name,
					},
					supplier: {
						id: supplier.id,
						name: supplier.name,
					},
				}
			})
			.filter((m): m is EnrichedMeasurement => m !== null)
	}

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

		const retentionPercentage =
			contract.retentionPercentage || contractWithoutRetentionPercentage

		const contractItemIds = params.items.map((item) => item.contractItemId)
		const contractItems = await this.contractItemRepo.findByIds(contractItemIds)

		const contractItemsMap = new Map(
			contractItems.map((item) => [item.id, item])
		)

		await this.validateAvailableQuantities(
			params.contractId,
			params.items,
			contractItemsMap
		)

		const measurementItems: MeasurementItemInputRepository[] = params.items.map(
			(item) => {
				const contractItem = contractItemsMap.get(item.contractItemId)
				if (!contractItem) {
					throw new NotFoundError(
						`Contract item with id ${item.contractItemId} not found`
					)
				}

				return {
					id: randomUUID(),
					measurementId,
					contractItemId: item.contractItemId,
					quantity: item.quantity,
					unitLaborValue: contractItem.unitLaborValue,
					totalGrossValue: item.quantity * contractItem.unitLaborValue,
				}
			}
		)

		const totalGrossValue = measurementItems.reduce(
			(sum, item) => sum + item.totalGrossValue,
			0
		)

		const retentionValue = totalGrossValue * (retentionPercentage / 100)

		const totalNetValue = totalGrossValue - retentionValue

		const createdMeasurement =
			await this.measurementRepo.createMeasurementWithItems({
				id: measurementId,
				contractId: params.contractId,
				issueDate: measurementIssueDate,
				totalGrossValue,
				retentionValue,
				totalNetValue,
				approvalStatus: 'PENDENTE',
				notes: params.notes,
				items: measurementItems,
			})

		return createdMeasurement
	}

	private async validateAvailableQuantities(
		contractId: UUID,
		items: { contractItemId: UUID; quantity: number }[],
		contractItemsMap: Map<string, { quantity: number; description: string }>
	): Promise<void> {
		const existingMeasurementItems =
			await this.measurementItemRepo.findByContractId(contractId)

		const measuredQuantitiesByItem = new Map<string, number>()
		for (const item of existingMeasurementItems) {
			const currentQuantity =
				measuredQuantitiesByItem.get(item.contractItemId) || 0
			measuredQuantitiesByItem.set(
				item.contractItemId,
				currentQuantity + item.quantity
			)
		}

		for (const item of items) {
			const contractItem = contractItemsMap.get(item.contractItemId)
			if (!contractItem) {
				continue
			}

			const alreadyMeasured =
				measuredQuantitiesByItem.get(item.contractItemId) || 0
			const availableQuantity = contractItem.quantity - alreadyMeasured

			if (item.quantity > availableQuantity) {
				throw new ValidationError(
					`Quantity ${item.quantity} exceeds available quantity ${availableQuantity} for contract item "${contractItem.description}"`
				)
			}
		}
	}
}
