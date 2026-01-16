import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, Table, Thead, Th, Tr, Td, Button } from '../components/UI'
import { formatCurrency } from '../utils/formatters'
import { ArrowLeft, Send } from 'lucide-react'
import { Work, ContractListItem } from '../types'
import { worksApi } from './services/works'
import { contractsApi, ContractResponse } from './services/contracts'
import {
	measurementsApi,
	CreateMeasurementRequest,
} from './services/measurements'

export const NewMeasurement = () => {
	const navigate = useNavigate()
	const { user: authUser } = useAuth()

	const [works, setWorks] = useState<Work[]>([])
	const [contracts, setContracts] = useState<ContractListItem[]>([])
	const [selectedContractDetails, setSelectedContractDetails] =
		useState<ContractResponse | null>(null)
	const [isLoadingData, setIsLoadingData] = useState(true)

	const [selectedWorkId, setSelectedWorkId] = useState<string>('')
	const [selectedContractId, setSelectedContractId] = useState<string>('')
	const [observation, setObservation] = useState('')

	const [inputQuantities, setInputQuantities] = useState<
		Record<string, number>
	>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)

	const canApprove = authUser?.permissions?.approveMeasurement ?? false

	useEffect(() => {
		const fetchWorks = async () => {
			try {
				const data = await worksApi.getAll()
				setWorks(data)
			} catch (error) {
				console.error('Error fetching works:', error)
			} finally {
				setIsLoadingData(false)
			}
		}
		fetchWorks()
	}, [])

	useEffect(() => {
		if (!selectedWorkId) {
			setContracts([])
			return
		}

		const fetchContracts = async () => {
			try {
				const data = await contractsApi.getAll({ workId: selectedWorkId })
				setContracts(data.filter((c) => c.status === 'Ativo'))
			} catch (error) {
				console.error('Error fetching contracts:', error)
			}
		}
		fetchContracts()
	}, [selectedWorkId])

	useEffect(() => {
		if (!selectedContractId) {
			setSelectedContractDetails(null)
			return
		}

		const fetchContractDetails = async () => {
			try {
				const data = await contractsApi.getById(selectedContractId)
				setSelectedContractDetails(data)
			} catch (error) {
				console.error('Error fetching contract details:', error)
			}
		}
		fetchContractDetails()
	}, [selectedContractId])

	const contractMath = useMemo(() => {
		if (!selectedContractDetails) return []

		return selectedContractDetails.items.map((item) => {
			const accumulatedQty = item.accumulatedQuantity ?? 0
			const balanceQty = item.quantity - accumulatedQty
			const currentQty = inputQuantities[item.id] || 0
			const currentTotal = currentQty * item.unitLaborValue

			return {
				...item,
				accumulatedQty,
				balanceQty,
				currentQty,
				currentTotal,
				isValid: currentQty <= balanceQty,
			}
		})
	}, [selectedContractDetails, inputQuantities])

	const totalMeasurementValue = contractMath.reduce(
		(acc, item) => acc + item.currentTotal,
		0
	)
	const totalContractedValue = selectedContractDetails?.totalValue || 0

	const previousAccumulatedValue = contractMath.reduce(
		(acc, item) => acc + item.accumulatedQty * item.unitLaborValue,
		0
	)

	const handleQuantityChange = (itemId: string, val: string) => {
		const num = parseFloat(val) || 0
		setInputQuantities((prev) => ({ ...prev, [itemId]: num }))
	}

	const goBack = () => {
		navigate(canApprove ? '/dashboard' : '/dashboard')
	}

	const handleSave = async () => {
		if (!selectedContractDetails) return

		setSubmitError(null)

		const items = Object.entries(inputQuantities)
			.filter(([_, qty]) => qty > 0)
			.map(([contractItemId, quantity]) => ({
				contractItemId,
				quantity,
			}))

		if (items.length === 0) {
			setSubmitError('Informe a quantidade de pelo menos um item.')
			return
		}

		for (const item of items) {
			const mathItem = contractMath.find((ci) => ci.id === item.contractItemId)
			if (mathItem && item.quantity > mathItem.balanceQty) {
				setSubmitError(
					`Quantidade do item "${mathItem.description}" excede o saldo disponível.`
				)
				return
			}
		}

		const request: CreateMeasurementRequest = {
			contractId: selectedContractDetails.id,
			notes: observation || undefined,
			items,
		}

		setIsSubmitting(true)

		try {
			await measurementsApi.create(request)
			setIsSuccess(true)
		} catch (error) {
			console.error('Error creating measurement:', error)
			if (error instanceof Error) {
				setSubmitError(error.message)
			} else {
				setSubmitError('Erro ao criar medição. Tente novamente.')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="space-y-6 pb-20">
			<header className="flex items-center gap-4">
				<Button variant="ghost" onClick={goBack}>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold text-textMain">Nova Medição</h1>
					<p className="text-textSec">
						Selecione a obra, o contrato e informe as quantidades.
					</p>
				</div>
			</header>

			<Card>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-textSec">Obra</label>
							<select
								className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none"
								value={selectedWorkId}
								onChange={(e) => {
									setSelectedWorkId(e.target.value)
									setSelectedContractId('')
									setInputQuantities({})
								}}
							>
								<option value="">
									{isLoadingData ? 'Carregando...' : 'Selecione a obra...'}
								</option>
								{works.map((w) => (
									<option key={w.id} value={w.id}>
										{w.name}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-textSec">
								Contrato
							</label>
							<select
								className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none disabled:bg-gray-100 disabled:text-gray-400"
								value={selectedContractId}
								onChange={(e) => {
									setSelectedContractId(e.target.value)
									setInputQuantities({})
								}}
								disabled={!selectedWorkId}
							>
								<option value="">
									{!selectedWorkId
										? 'Selecione uma obra primeiro...'
										: 'Selecione o contrato...'}
								</option>
								{contracts.map((c) => (
									<option key={c.id} value={c.id}>
										{c.supplier.name} - {c.service}
									</option>
								))}
							</select>
						</div>
					</div>

					{selectedContractDetails && (
						<div className="bg-gray-50 p-4 rounded-lg border border-border flex flex-col justify-center">
							<h3 className="font-semibold text-textMain mb-3 border-b border-gray-200 pb-2">
								Resumo Financeiro do Contrato
							</h3>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<span className="block text-xs text-textSec">
										Valor Contrato
									</span>
									<span className="font-semibold text-textMain">
										{formatCurrency(totalContractedValue)}
									</span>
								</div>
								<div>
									<span className="block text-xs text-textSec">
										Acumulado Anterior
									</span>
									<span className="font-semibold text-textMain">
										{formatCurrency(previousAccumulatedValue)}
									</span>
								</div>
								<div>
									<span className="block text-xs text-textSec">
										Saldo Contratual
									</span>
									<span className="font-semibold text-primary">
										{formatCurrency(
											totalContractedValue - previousAccumulatedValue
										)}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</Card>

			{selectedContractDetails && (
				<>
					<Card title="Itens do Contrato">
						<Table>
							<Thead>
								<Tr>
									<Th>Item / Descrição</Th>
									<Th className="text-center">Und</Th>
									<Th className="text-right">Qtd. Contratada</Th>
									<Th className="text-right">Acumulado</Th>
									<Th className="text-right">Saldo a Medir</Th>
									<Th className="text-right w-32 bg-green-50">Qtd. Atual</Th>
									<Th className="text-right">Vlr. Unit.</Th>
									<Th className="text-right font-bold">Total Item</Th>
								</Tr>
							</Thead>
							<tbody>
								{contractMath.map((item) => (
									<Tr
										key={item.id}
										className={!item.isValid ? 'bg-red-50' : ''}
									>
										<Td className="font-medium text-textMain">
											{item.description}
										</Td>
										<Td className="text-center text-textSec">
											{item.unitMeasure}
										</Td>
										<Td className="text-right">{item.quantity}</Td>
										<Td className="text-right text-textSec">
											{item.accumulatedQty}
										</Td>
										<Td className="text-right font-medium text-primary">
											{item.balanceQty}
										</Td>
										<Td className="bg-green-50 p-2">
											<input
												type="number"
												min="0"
												max={item.balanceQty}
												className={`w-full text-right p-1 border rounded focus:ring-2 focus:ring-primary outline-none ${
													!item.isValid
														? 'border-red-500 text-red-600'
														: 'border-gray-300'
												}`}
												value={item.currentQty || ''}
												onChange={(e) =>
													handleQuantityChange(item.id, e.target.value)
												}
												placeholder="0"
											/>
											{!item.isValid && (
												<div className="text-[10px] text-red-500 text-right">
													Excede saldo
												</div>
											)}
										</Td>
										<Td className="text-right text-textSec">
											{formatCurrency(item.totalValue)}
										</Td>
										<Td className="text-right font-bold text-textMain">
											{formatCurrency(item.currentTotal)}
										</Td>
									</Tr>
								))}
							</tbody>
						</Table>

						<div className="p-4 bg-surfaceHighlight border-t border-border mt-4 flex justify-end items-center gap-6">
							<div className="text-right">
								<span className="block text-sm text-textSec">
									Total desta Medição
								</span>
								<span className="text-2xl font-bold text-primary">
									{formatCurrency(totalMeasurementValue)}
								</span>
							</div>
						</div>
					</Card>

					<Card title="Observações">
						<textarea
							className="w-full h-24 p-3 border border-border rounded focus:ring-2 focus:ring-secondary outline-none text-sm resize-none"
							placeholder="Digite aqui observações relevantes sobre o andamento dos serviços..."
							value={observation}
							onChange={(e) => setObservation(e.target.value)}
						/>
					</Card>

					{submitError && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
							{submitError}
						</div>
					)}

					<div className="fixed bottom-0 left-64 right-0 bg-white border-t border-border p-4 shadow-lg flex justify-end gap-4 z-20">
						<Button variant="ghost" onClick={goBack}>
							Cancelar
						</Button>
						<Button
							variant="primary"
							onClick={handleSave}
							disabled={isSubmitting || !selectedContractDetails}
						>
							<Send className="w-4 h-4 mr-2" />
							{isSubmitting ? 'Enviando...' : 'Enviar para Aprovação'}
						</Button>
					</div>
				</>
			)}

			{isSuccess && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
						<div className="flex flex-col items-center text-center mb-6">
							<div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
								<svg
									className="w-10 h-10 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold text-textMain mb-2">
								Medição criada com sucesso!
							</h3>
							<p className="text-sm text-textSec">
								Sua medição foi enviada para aprovação.
							</p>
						</div>

						<div className="flex flex-col gap-3">
							<Button
								variant="primary"
								onClick={() => navigate('/dashboard')}
								className="w-full"
							>
								Ir para o Dashboard
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
