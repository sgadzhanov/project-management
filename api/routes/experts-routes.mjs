import express from 'express'
import {
  addExpert,
  findAllExperts,
  findById,
  updateExpert,
} from '../controllers/experts-controller.mjs'

const router = express.Router()

router.get('/', findAllExperts)
router.get('/:id', findById)
router.put('/:id', updateExpert)
router.post('/', addExpert)

export default router
