import { z } from 'zod'

export const workFormSchema = z.object({
	name: z.string().trim().min(1, 'O nome do Local é obrigatório'),
	address: z.string().trim().min(1, 'O endereço é obrigatório'),
	contractor: z.string().optional(),
	status: z.enum(['ATIVA', 'CONCLUIDA']),
})

export type WorkFormData = z.infer<typeof workFormSchema>
