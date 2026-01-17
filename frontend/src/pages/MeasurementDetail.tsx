import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, Badge, Button, Input } from '../components/UI'
import { formatCurrency } from '../utils/formatters'
import { ArrowLeft, CheckCircle, XCircle, Download, Send } from 'lucide-react'
import {
	measurementsApi,
	EnrichedMeasurementResponse,
} from './services/measurements'

export const MeasurementDetail = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user: authUser } = useAuth()
	const [directorNote, setDirectorNote] = useState('')
	const [measurement, setMeasurement] =
		useState<EnrichedMeasurementResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchMeasurement = async () => {
			try {
				const measurements = await measurementsApi.getAll()
				const found = measurements.find((m) => m.id === id)
				setMeasurement(found || null)
			} catch (error) {
				console.error('Error fetching measurement:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchMeasurement()
	}, [id])

	if (isLoading) return <div className="p-8">Carregando...</div>
	if (!measurement) return <div className="p-8">Medição não encontrada.</div>

	const canApprove = authUser?.permissions?.approveMeasurement ?? false
	const isPending = measurement.approvalStatus === 'PENDENTE'
	const isApproved = measurement.approvalStatus === 'APROVADA'

	const handleApprove = () => {
		if (
			window.confirm(
				'Confirma a aprovação desta medição?\nO PDF será gerado e enviado ao financeiro.'
			)
		) {
			// TODO: Implement approval via API
			alert('Funcionalidade de aprovação em desenvolvimento')
			navigate('/dashboard')
		}
	}

	const handleReject = () => {
		if (!directorNote) {
			alert('Para reprovar, é necessário inserir uma observação.')
			return
		}
		// TODO: Implement rejection via API
		alert('Funcionalidade de rejeição em desenvolvimento')
		navigate('/dashboard')
	}

	const handleSendToFinance = () => {
		alert('PDF enviado novamente para o setor financeiro.')
	}

	return (
		<div className="space-y-6 pb-20">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button variant="ghost" onClick={() => navigate(-1)}>
						<ArrowLeft className="w-5 h-5" />
					</Button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold text-textMain">
								Medição #{measurement.id.slice(0, 8)}
							</h1>
							<Badge status={measurement.approvalStatus} />
						</div>
						<p className="text-textSec mt-1">
							{measurement.work.name} • {measurement.contract.service}
						</p>
					</div>
				</div>
				{isApproved && (
					<div className="flex gap-2">
						<Button onClick={handleSendToFinance} variant="ghost">
							<Send className="w-4 h-4 mr-2" /> Enviar p/ Financeiro
						</Button>
						<Button onClick={() => '' /* PDF */} variant="secondary">
							<Download className="w-4 h-4 mr-2" /> Baixar PDF
						</Button>
					</div>
				)}
			</header>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="col-span-2 space-y-6">
					<Card title="Detalhes da Medição">
						<div className="space-y-4">
							<div className="flex justify-between items-center p-4 bg-surfaceHighlight rounded">
								<span className="text-textSec">Valor Bruto</span>
								<span className="text-lg font-semibold">
									{formatCurrency(measurement.totalGrossValue)}
								</span>
							</div>
							<div className="flex justify-between items-center p-4 bg-surfaceHighlight rounded">
								<span className="text-textSec">Retenção</span>
								<span className="text-lg font-semibold text-red-600">
									-{formatCurrency(measurement.retentionValue)}
								</span>
							</div>
							<div className="flex justify-between items-center p-4 bg-primary/10 rounded border-2 border-primary">
								<span className="text-textMain font-bold">Valor Líquido</span>
								<span className="text-2xl font-bold text-primary">
									{formatCurrency(measurement.totalNetValue)}
								</span>
							</div>
							{measurement.notes && (
								<div className="p-4 bg-blue-50 rounded border border-blue-200">
									<p className="text-sm font-semibold text-blue-900 mb-1">
										Observações:
									</p>
									<p className="text-sm text-blue-800">{measurement.notes}</p>
								</div>
							)}
						</div>
					</Card>
				</div>

				<div className="space-y-6">
					<Card title="Informações">
						<div className="space-y-4 text-sm">
							<div>
								<label className="text-textSec block mb-1">Obra</label>
								<p className="font-medium text-textMain">
									{measurement.work.name}
								</p>
							</div>
							<div>
								<label className="text-textSec block mb-1">Fornecedor</label>
								<p className="font-medium text-textMain">
									{measurement.supplier.name}
								</p>
							</div>
							<div>
								<label className="text-textSec block mb-1">Serviço</label>
								<p className="font-medium text-textMain">
									{measurement.contract.service}
								</p>
							</div>
							<div>
								<label className="text-textSec block mb-1">
									Data de Emissão
								</label>
								<p className="font-medium text-textMain">
									{new Date(measurement.issueDate).toLocaleDateString('pt-BR')}
								</p>
							</div>
							{measurement.approvalDate && (
								<div>
									<label className="text-textSec block mb-1">
										Data de Aprovação
									</label>
									<p className="font-medium text-textMain">
										{new Date(measurement.approvalDate).toLocaleDateString(
											'pt-BR'
										)}
									</p>
								</div>
							)}
						</div>
					</Card>

					{canApprove && isPending && (
						<Card
							title="Aprovação"
							className="border-t-4 border-t-primary shadow-md"
						>
							<div className="space-y-4">
								<Input
									label="Observações / Motivo Reprovação"
									placeholder="Adicione notas internas..."
									value={directorNote}
									onChange={(e) => setDirectorNote(e.target.value)}
								/>
								<div className="grid grid-cols-2 gap-3">
									<Button variant="danger" onClick={handleReject}>
										<XCircle className="w-4 h-4 mr-2" /> Reprovar
									</Button>
									<Button variant="primary" onClick={handleApprove}>
										<CheckCircle className="w-4 h-4 mr-2" /> Aprovar
									</Button>
								</div>
								<p className="text-xs text-center text-textSec">
									Ao aprovar, o PDF será enviado ao financeiro.
								</p>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}
