import express from 'express'
import { findAllProjectStatuses } from '../controllers/project-status-controller.mjs'

const router = express.Router()

router.get('/', findAllProjectStatuses)

export default router
