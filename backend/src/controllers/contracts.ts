import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { contractService } from '../services/instances.js'

export const createContractHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const contractParams = req.body
		const contract =
			await contractService.createContractWithItems(contractParams)
		res.status(201).json(contract)
	}
)

export const getContractsHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const { workId, supplierId, status, approvalStatus, includeDetails } =
			req.query

		const contracts = await contractService.getContracts(
			{
				workId: workId as string | undefined,
				supplierId: supplierId as string | undefined,
				status: status as 'Ativo' | 'Concluído' | undefined,
				approvalStatus: approvalStatus as 'Pendente' | 'Aprovado' | undefined,
			},
			includeDetails === 'true'
		)

		res.status(200).json(contracts)
	}
)

export const getContractHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const id = req.params.id
		const contract =
			await contractService.getContractWithWorkAndSupplierData(id)

		if (!contract) {
			res.status(404).json({ message: 'Contract not found' })
			return
		}

		res.status(200).json(contract)
	}
)
