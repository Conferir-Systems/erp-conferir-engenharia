import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	ArrowLeft,
	Loader2,
	FileText,
	Download,
	MapPin,
	User,
	CreditCard,
	Wallet,
} from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { contractsApi } from './services/contracts'
import { Card, Table, Thead, Th, Tr, Td, Button, Badge } from '../components/UI'
import { ContractDocument } from '../components/pdf/ContractDocument'
import { formatCurrency, formatDate, formatDocument } from '../utils/formatters'
import { prepareContractData } from '../helpers/contractHelpers'
import { Tooltip } from '../components/Tooltip'
import { Work, Supplier, ContractResponse } from '../types/index'

const WorkTooltipContent = ({ work }: { work: Work }) => (
	<div className="space-y-2">
		<div className="flex items-start gap-2">
			<MapPin className="w-4 h-4 text-textSec mt-0.5 flex-shrink-0" />
			<div>
				<div className="text-xs text-textSec">Endereço</div>
				<div className="text-sm text-textMain">{work.address}</div>
			</div>
		</div>
		{work.contractor && (
			<div className="flex items-start gap-2">
				<User className="w-4 h-4 text-textSec mt-0.5 flex-shrink-0" />
				<div>
					<div className="text-xs text-textSec">Contratante</div>
					<div className="text-sm text-textMain">{work.contractor}</div>
				</div>
			</div>
		)}
		<div className="flex items-start gap-2">
			<div className="mt-0.5">
				<div className="text-xs text-textSec">Status</div>
				<div className="mt-1">
					<Badge status={work.status} />
				</div>
			</div>
		</div>
	</div>
)

const SupplierTooltipContent = ({ supplier }: { supplier: Supplier }) => (
	<div className="space-y-2">
		<div className="flex items-start gap-2">
			<CreditCard className="w-4 h-4 text-textSec mt-0.5 flex-shrink-0" />
			<div>
				<div className="text-xs text-textSec">Documento</div>
				<div className="text-sm text-textMain">
					{formatDocument(supplier.document)}
				</div>
			</div>
		</div>
		<div className="flex items-start gap-2">
			<User className="w-4 h-4 text-textSec mt-0.5 flex-shrink-0" />
			<div>
				<div className="text-xs text-textSec">Tipo de Pessoa</div>
				<div className="text-sm text-textMain">
					{supplier.typePerson === 'FISICA'
						? 'Pessoa Física'
						: 'Pessoa Jurídica'}
				</div>
			</div>
		</div>
		{supplier.pix && (
			<div className="flex items-start gap-2">
				<Wallet className="w-4 h-4 text-textSec mt-0.5 flex-shrink-0" />
				<div>
					<div className="text-xs text-textSec">Chave PIX</div>
					<div className="text-sm text-textMain">{supplier.pix}</div>
				</div>
			</div>
		)}
	</div>
)

export const ContractDetails = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const [contract, setContract] = useState<ContractResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (id) {
			fetchContract(id)
		}
	}, [id])

	const fetchContract = async (contractId: string) => {
		try {
			setLoading(true)
			setError(null)
			const data = await contractsApi.getById(contractId)
			setContract(data)
		} catch (err) {
			console.error('Error fetching contract:', err)
			setError('Erro ao carregar contrato. Tente novamente.')
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		)
	}

	if (error || !contract) {
		return (
			<div className="space-y-6">
				<header className="flex items-center gap-4">
					<Button variant="ghost" onClick={() => navigate(-1)}>
						<ArrowLeft className="w-5 h-5" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-textMain">
							Detalhes do Contrato
						</h1>
					</div>
				</header>
				<div className="text-center py-12">
					<p className="text-red-500 mb-4">
						{error || 'Contrato não encontrado'}
					</p>
					<Button onClick={() => navigate(-1)}>Voltar</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 pb-20 relative">
			<header className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button variant="ghost" onClick={() => navigate(-1)}>
						<ArrowLeft className="w-5 h-5" />
					</Button>
					<div className="flex items-center gap-3">
						<FileText className="w-6 h-6 text-primary" />
						<div>
							<h1 className="text-2xl font-bold text-textMain">
								Detalhes do Contrato
							</h1>
							<p className="text-textSec">{contract.service}</p>
						</div>
					</div>
				</div>
				<PDFDownloadLink
					document={<ContractDocument data={prepareContractData(contract)} />}
					fileName={`contrato ${contract.service.toLowerCase()}.pdf`}
				>
					{({ loading }: { loading: boolean }) => (
						<Button
							variant="primary"
							className="flex items-center gap-2"
							disabled={loading}
						>
							<Download className="w-5 h-5" />
							{loading ? 'Gerando PDF...' : 'Gerar PDF'}
						</Button>
					)}
				</PDFDownloadLink>
			</header>

			<Card
				title={
					<span className="flex items-center gap-3">
						Informações do Contrato
						<Badge
							status={contract.status === 'Ativo' ? 'ATIVO' : 'CONCLUIDO'}
						/>
					</span>
				}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium text-textSec">Obra</label>
							<div className="text-base text-textMain font-medium">
								{contract.work ? (
									<Tooltip
										trigger={<span>{contract.work.name}</span>}
										content={<WorkTooltipContent work={contract.work} />}
									/>
								) : (
									'-'
								)}
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium text-textSec">
								Fornecedor
							</label>
							<div className="text-base text-textMain font-medium">
								{contract.supplier ? (
									<Tooltip
										trigger={<span>{contract.supplier.name}</span>}
										content={
											<SupplierTooltipContent supplier={contract.supplier} />
										}
									/>
								) : (
									'-'
								)}
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium text-textSec">
								Serviço
							</label>
							<p className="text-base text-textMain">{contract.service}</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-textSec">
									Data Início
								</label>
								<p className="text-base text-textMain">
									{formatDate(contract.startDate)}
								</p>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-textSec">
									Prazo de Entrega
								</label>
								<p className="text-base text-textMain">
									{formatDate(contract.deliveryTime)}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-textSec">
									Valor Total
								</label>
								<p className="text-2xl font-bold text-primary">
									{formatCurrency(contract.totalValue)}
								</p>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-textSec">
									Porcentagem de retenção
								</label>
								<p className="text-base text-textMain">
									{Number(contract.retentionPercentage ?? 0).toFixed(2)}%
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-4"></div>

					<div className="space-y-4"></div>
				</div>
			</Card>

			<Card title="Itens da Planilha Contratual">
				<Table>
					<Thead>
						<Tr>
							<Th>Descrição do Item</Th>
							<Th className="w-20 text-center">Und</Th>
							<Th className="w-24 text-right">Qtd</Th>
							<Th className="w-32 text-right">Unit. M.O</Th>
							<Th className="w-32 text-right">Total</Th>
						</Tr>
					</Thead>
					<tbody>
						{contract.items.map((item) => (
							<Tr key={item.id}>
								<Td className="font-medium">{item.description}</Td>
								<Td className="text-center">{item.unitMeasure}</Td>
								<Td className="text-right">
									{item.quantity.toLocaleString('pt-BR')}
								</Td>
								<Td className="text-right">
									{formatCurrency(item.unitLaborValue)}
								</Td>
								<Td className="text-right font-semibold">
									{formatCurrency(item.totalValue)}
								</Td>
							</Tr>
						))}
						{contract.items.length === 0 && (
							<Tr>
								<Td colSpan={5} className="text-center py-8 text-textSec">
									Nenhum item cadastrado.
								</Td>
							</Tr>
						)}
					</tbody>
				</Table>

				<div className="p-4 bg-gray-50 border-t border-border flex justify-end items-center">
					<div className="text-right">
						<span className="text-sm text-textSec mr-2">
							Valor Total do Contrato:
						</span>
						<span className="text-xl font-bold text-primary">
							{formatCurrency(contract.totalValue)}
						</span>
					</div>
				</div>
			</Card>
		</div>
	)
}
