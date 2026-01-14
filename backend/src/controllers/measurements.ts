import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { measurementService } from '../services/Measurement.js'

export const createMeasurementHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const measurementParams = req.body

        const measurement =
            await measurementService.createMeasurementWithItems(measurementParams)

        res.status(201).json(measurement)
    }
)

export const getMeasurement = asyncHandler(
    async (req: Request, res: Response) => {
        const id = req.params.id

        const measurement = 
            await measurementService.getMeasurement(id)

        res.status(200).json(measurement)
    }
)

export const getMeasurementHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const measurements = await measurementService.getMeasurements()

        res.status(200).json(measurements)
    }
)