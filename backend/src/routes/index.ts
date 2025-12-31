import express from 'express'
import authRoutes from './auth'
import { authenticate } from '../middleware/auth'
import { validate } from '../validation/middleware'
import { createUserSchema } from '../validation/schemas/users'
import { createUserHandler } from '../controllers/users'
import usersRoutes from './users'
import userTypesRoutes from './userTypes'
import worksRoutes from './works'
import suppliersRoutes from './suppliers'
import { getUserTypeSchema } from '../validation/schemas/userTypes'
import { getUserTypeHandler } from '../controllers/userTypes'

const router = express.Router()

router.use('/auth', authRoutes)
router.post('/users', validate(createUserSchema), createUserHandler)
router.get('/user-types', validate(getUserTypeSchema), getUserTypeHandler)

router.use(authenticate)
router.use(usersRoutes)
router.use(userTypesRoutes)
router.use(worksRoutes)
router.use(suppliersRoutes)

export default router
