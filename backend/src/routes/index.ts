import express from 'express'
import usersRoutes from './users'
import userTypesRoutes from './userTypes'
import worksRoutes from './works'
import suppliersRoutes from './suppliers'

const router = express.Router()

router.use(usersRoutes)
router.use(userTypesRoutes)
router.use(worksRoutes)
router.use(suppliersRoutes)

export default router
