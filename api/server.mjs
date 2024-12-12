import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user-routes.mjs'
import projectsRoutes from './routes/projects-routes.mjs'
import expertsRoutes from './routes/experts-routes.mjs'
import projectTasksRoutes from './routes/projects-tasks-routes.mjs'
import projectStatusRoutes from './routes/project-status-routes.mjs'

const app = express()

const corsConfig = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}

app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

app.use(express.json({ limit: '50mb' }))
app.use('/api/experts', expertsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/tasks', projectTasksRoutes)
app.use('/api/status', projectStatusRoutes)
app.use('/api/login', userRoutes)

app.listen(5000, () => console.log('App listening on port 5000'))
