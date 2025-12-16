import { Request, Response, NextFunction } from 'express'
import { workService } from '../../services/instances'
import { NotFoundError } from '../../errors'

export async function createWorkHandler(
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

export async function getWorkHandler(
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

export async function updateWorkHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const work = await workService.updateWork(req.params.id, req.body)

    if (!work) {
      throw new NotFoundError(`Work with id ${req.params.id} does not exist`)
    }

    res.status(200).json(work)
  } catch (err) {
    next(err)
  }
}

export async function deleteWorkHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await workService.deleteWork(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
