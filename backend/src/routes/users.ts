import express from 'express'
import { createUser } from '../services/createUser'

const router = express.Router()

router.post('/users', createUser)

export default router
