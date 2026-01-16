import { z } from 'zod'

const measurementItemSchema = z.object({
	contractItemId: z.string().uuid('Invalid contract item ID'),
	quantity: z.number().positive('Quantity must be positive'),
})

export const createMeasurementSchema = z.object({
	body: z.object({
		contractId: z.string().uuid('Invalid contract ID'),
		notes: z
			.string()
			.trim()
			.max(1000, 'Notes must be max 1000 characters')
			.optional(),
		items: z
			.array(measurementItemSchema)
			.min(1, 'At least one item is required'),
	}),
})

export const getMeasurementSchema = z.object({
	params: z.object({
		id: z.string().uuid('Invalid measurement ID'),
	}),
})

export type CreateMeasurementInput = z.infer<typeof createMeasurementSchema>
export type GetMeasurementInput = z.infer<typeof getMeasurementSchema>
