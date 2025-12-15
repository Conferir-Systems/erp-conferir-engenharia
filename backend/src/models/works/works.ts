export type Work = {
  id: string
  name: string
  code: string | null
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
}

export type CreateWorkRequest = {
  id: string
  name: string
  code?: string
  address: string
  contractor?: string
  status?: 'ATIVA' | 'CONCLUIDA'
}

export type UpdateWorkRequest = {
  name: string
  code?: string | null // Null if user want to clear the value
  address: string
  contractor?: string | null
}
