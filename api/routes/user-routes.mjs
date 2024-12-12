import express from 'express'
import { login } from '../controllers/users-controller.mjs'

const router = express.Router()

router.post('/', login)

export default router
