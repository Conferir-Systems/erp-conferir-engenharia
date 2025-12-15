import express from 'express'
import { createWorkRequest, getWork } from '../../controllers/works/works'

const router = express.Router()

router.post('/works', createWorkRequest)
router.get('/works/:id', getWork)

export default router
