import express from 'express'
import { validate } from '../validation/middleware.js'
import { 
    createMeasurementSchema,
    getMeasurementSchema
} from '../schemas/measurements.js'
import {
    createMeasurementHandler,
    getMeasurementHandler,
    getMeasurementsHandler
} from '../controllers/measurements.js'

const router = express.Router()

router.post('/measurements', validate(createMeasurementSchema), createMeasurementHandler)
router.get('/measurements/:id', validate(getMeasurementSchema), getMeasurementHandler)
router.get('/measurements', getMeasurementsHandler)