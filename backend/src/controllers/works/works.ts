import { Request, Response } from 'express'
import { createWork, updateWork, deleteWork } from '../../services/works/works'
import { workRepository } from '../../repository/works/works'

export async function createWorkHandler(
  req: Request,
  res: Response
): Promise<void> {
  const workParams = req.body
  try {
    const work = await createWork(workParams)
    res.status(201).json(work)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: 'Failed to create work',
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}

export async function getWorkHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id
  try {
    const work = await workRepository.findById(id)

    if (!work) {
      res.status(404).json({
        error: 'Work not found',
        message: `Work with id ${id} does not exist`,
      })
      return
    }

    res.status(200).json(work)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: 'Failed to fetch work',
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}

export async function updateWorkHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id
  const data = req.body
  try {
    const work = await updateWork(id, data)

    if (!work) {
      res.status(404).json({
        error: 'Work not found',
        message: `Work with id ${id} does not exist`,
      })
      return
    }

    res.status(200).json(work)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: 'Failed to updated work',
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}

export async function deleteWorkHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id
  try {
    await deleteWork(id)

    res.status(204).send()
  } catch (err) {
    console.error(err)

    if (err instanceof Error && err.message === 'Work not found') {
      res.status(404).json({
        error: 'Work not found',
        message: `Work with id ${id} does not exist`,
      })
      return
    }

    res.status(500).json({
      error: 'Failed to delete work',
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}
