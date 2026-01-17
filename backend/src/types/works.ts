import type { UUID } from './common.js'

export type WorkStatus = 'ATIVA' | 'CONCLUIDA'

export type Work = {
	id: UUID
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
