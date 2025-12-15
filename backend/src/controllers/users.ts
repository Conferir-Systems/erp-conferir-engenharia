import { Request, Response } from 'express'
import { createUser } from '../services/createUser'
import { userRepository } from '../repository/users'

export async function createUserRequest(
  req: Request,
  res: Response
): Promise<void> {
  const userParams = req.body
  try {
    const user = await createUser(userParams)
    res.status(201).json(user)
  } catch (err) {
    console.error(err)

    if (err instanceof Error) {
      const errorMessage = err.message.toLowerCase()

      if (errorMessage.includes('email already exists')) {
        res.status(409).json({
          message: err.message,
          error: 'O e-mail informado já está cadastrado no sistema',
        })
        return
      }

      if (
        errorMessage.includes('required') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('must be') ||
        errorMessage.includes('cannot contain') ||
        errorMessage.includes('contains invalid') ||
        errorMessage.includes('at least') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('cannot')
      ) {
        res.status(400).json({
          message: err.message,
          error: err.message,
        })
        return
      }
    }

    res.status(500).json({
      message: 'Internal server error',
      error: 'Erro ao processar requisição',
    })
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  try {
    const user = await userRepository.findById(id)

    if (!user) throw new Error('User not found')

    res.status(200).json(user)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}
