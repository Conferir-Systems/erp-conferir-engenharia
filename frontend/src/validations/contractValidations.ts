import { z } from 'zod'

export const contractItemSchema = z.object({
	description: z.string().trim().min(1, 'A descrição do item é obrigatória'),
	unitMeasure: z.string().trim().min(1, 'A unidade de medida é obrigatória'),
	quantity: z.number().positive('A quantidade deve ser maior que zero'),
	unitLaborValue: z
		.number()
		.positive('O valor unitário deve ser maior que zero'),
})

export const contractFormSchema = z
	.object({
		workId: z.string().min(1, 'A obra é obrigatória'),
		supplierId: z.string().min(1, 'O fornecedor é obrigatório'),
		service: z.string().trim().min(1, 'O serviço é obrigatório'),
		retentionPercentage: z
			.number()
			.min(0, 'Retenção deve estar entre 0 e 99.9%')
			.max(99.9, 'Retenção deve estar entre 0 e 99.9%'),
		startDate: z.string().min(1, 'A data de início é obrigatória'),
		deliveryTime: z.string().min(1, 'O prazo de entrega é obrigatório'),
		items: z.array(contractItemSchema).min(1, 'Adicione pelo menos um item'),
	})
	.refine(
		(data) => {
			if (!data.startDate || !data.deliveryTime) return true
			const start = new Date(data.startDate)
			const delivery = new Date(data.deliveryTime)
			return delivery >= start
		},
		{
			message: 'O prazo de entrega não pode ser anterior à data de início',
			path: ['deliveryTime'],
		}
	)

export type ContractFormData = z.infer<typeof contractFormSchema>
export type ContractItemData = z.infer<typeof contractItemSchema>
