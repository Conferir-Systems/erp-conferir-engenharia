export type WorkStatus = 'ATIVA' | 'CONCLUIDA'

export type Work = {
	id: string
	name: string
	code: number
	address: string
	contractor: string | null
	status: WorkStatus
}

export type CreateWorkRequest = {
	name: string
	address: string
	contractor?: string
	status?: WorkStatus
}

export type UpdateWorkRequest = {
	name?: string
	address?: string
	contractor?: string | null
	status?: WorkStatus
}
