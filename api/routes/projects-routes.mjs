import express from 'express'
import {
  createProject,
  deleteProject,
  editProject,
  findAllProjects, findProjectById
} from '../controllers/projects-controller.mjs'

const router = express.Router()

router.get('/', findAllProjects)
router.post('/', createProject)
router.get('/:id', findProjectById)
router.put('/:id', editProject)
router.delete('/:id', deleteProject)

export default router
