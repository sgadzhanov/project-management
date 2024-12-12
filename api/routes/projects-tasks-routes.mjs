import express from 'express'
import { findAllTasksForProject } from '../controllers/project-tasks-controller.mjs'

const router = express.Router()

router.get('/:id', findAllTasksForProject)

export default router
