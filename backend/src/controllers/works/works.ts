import { Request, Response, NextFunction } from 'express'
import { workService } from '../../services/instances'
import { NotFoundError } from '../../errors'

export async function createWorkRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const work = await workService.createWork(req.body)
    res.status(201).json(work)
  } catch (err) {
    next(err)
  }
}

export async function getWork(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const work = await workService.getWorkById(req.params.id)

    if (!work) {
      throw new NotFoundError(`Work with id ${req.params.id} does not exist`)
    }

    res.status(200).json(work)
  } catch (err) {
    next(err)
  }
}
