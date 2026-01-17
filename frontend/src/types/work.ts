import type { UUID } from './index.js'

export type Work = {
	id: UUID
	name: string
	code?: string
	address: string
	contractor?: string
	status: 'ATIVA' | 'CONCLUIDA'
	createdAt?: string
	updatedAt?: string
}
