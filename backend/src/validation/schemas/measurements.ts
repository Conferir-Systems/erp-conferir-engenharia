import { z } from 'zod'

const measurementItemSchema = z.object({
	contractItemId: z.string().uuid('Invalid contract item ID'),
	quantity: z.number().positive('Quantity must be positive'),
	unitLaborValue: z.number().nonnegative('Unit labor value cannot be negative'),
	totalGrossValue: z
		.number()
		.nonnegative('Total gross value cannot be negative'),
})

export const createMeasurementSchema = z.object({
	body: z.object({
		contractId: z.string().uuid('Invalid contract ID'),
		issueDate: z.coerce.date({
			message: 'Issue date must be a valid date',
		}),
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
