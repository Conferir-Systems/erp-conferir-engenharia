import express from 'express'
import {
  createSupplierHandler,
  getSupplierHandler,
  getSuppliersHandler,
} from '../controllers/suppliers'
import { validate } from '../validation/middleware'
import {
  createSupplierSchema,
  getSupplierSchema,
} from '../validation/schemas/suppliers'

const router = express.Router()

router.post('/suppliers', validate(createSupplierSchema), createSupplierHandler)
router.get('/suppliers/:id', validate(getSupplierSchema), getSupplierHandler)
router.get('/suppliers', getSuppliersHandler)

export default router
