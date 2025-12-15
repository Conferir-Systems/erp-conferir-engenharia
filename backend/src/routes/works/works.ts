import express from 'express'
import {
  createWorkHandler,
  getWorkHandler,
  updateWorkHandler,
  deleteWorkHandler,
} from '../../controllers/works/works'

const router = express.Router()

router.post('/works', createWorkHandler)
router.get('/works/:id', getWorkHandler)
router.put('/works/:id', updateWorkHandler)
router.delete('/works/:id', deleteWorkHandler)

export default router
