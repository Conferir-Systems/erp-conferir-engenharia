import { z } from 'zod'

const workId = z.uuid({ version: 'v4' })
const supplierId = z.uuid({ version: 'v4' })
const service = z
  .string()
  .trim()
  .max(255, 'Description must be max 255 characters')
const startDate = z.coerce.date({
  message: 'Start date must be a valid date',
})
const deliveryTime = z.coerce
  .date({
    message: 'Delivery time must be a valid date',
  })
  .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Delivery time cannot be in the past',
  })
  .optional()
  .nullable()

const contractItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be max 500 characters'),
  unitMeasure: z
    .string()
    .trim()
    .min(1, 'Unit measure is required')
    .max(20, 'Unit measure must be max 20 characters'),
  quantity: z.number().positive('Quantity must be positive'),
  unitLaborValue: z.number().nonnegative('Unit labor value cannot be negative'),
})

export const createContractSchema = z.object({
  body: z.object({
    workId: workId,
    supplierId: supplierId,
    service: service,
    startDate: startDate,
    deliveryTime: deliveryTime,
    items: z.array(contractItemSchema).min(1, 'At least one item is required'),
  }),
})

export const getContractSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid contract ID'),
  }),
})

export type CreateContractInput = z.infer<typeof createContractSchema>
