import { z } from 'zod'

export const supplierFormSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, 'O nome/razão social é obrigatório')
			.min(3, 'O nome deve ter no mínimo 3 caracteres')
			.max(60, 'O nome deve ter no máximo 60 caracteres'),
		typePerson: z.enum(['FISICA', 'JURIDICA']),
		document: z.string().min(1, 'O documento é obrigatório'),
		pix: z
			.string()
			.trim()
			.min(8, 'A chave PIX deve ter no mínimo 8 caracteres')
			.max(45, 'A chave PIX deve ter no máximo 45 caracteres')
			.optional()
			.or(z.literal('')),
	})
	.refine(
		(data) => {
			const digitsOnly = data.document.replace(/\D/g, '')
			if (data.typePerson === 'JURIDICA') {
				return digitsOnly.length === 14
			} else {
				return digitsOnly.length === 11
			}
		},
		(data) => ({
			message:
				data.typePerson === 'JURIDICA'
					? 'O CNPJ deve ter exatamente 14 dígitos'
					: 'O CPF deve ter exatamente 11 dígitos',
			path: ['document'],
		})
	)

export type SupplierFormData = z.infer<typeof supplierFormSchema>
