import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import ProjectsPage from './components/pages/ProjectsPage.jsx'
import ExpertsPage from './components/pages/ExpertsPage.jsx'
import ProjectDetails from './components/pages/ProjectDetailsPage.jsx'
import ExpertDetails from './components/pages/ExpertDetails.jsx'
import NotFound from './components/NotFound.jsx'
import Login from './components/Login.jsx'
import PrivateRoute from './components/pages/PrivateRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: '/projects',
    element: (
      <Layout>
        <PrivateRoute>
          <ProjectsPage />
        </PrivateRoute>
      </Layout>
    ),
  },
  { path: '/projects/:id', element: <Layout><PrivateRoute><ProjectDetails /></PrivateRoute></Layout> },
  { path: '/experts', element: <Layout><PrivateRoute><ExpertsPage /></PrivateRoute></Layout> },
  { path: '/experts/:id', element: <Layout><PrivateRoute><ExpertDetails /></PrivateRoute></Layout> },
  { path: '/login', element: <Layout><Login /></Layout> },
  { path: '*', element: <Layout><NotFound /></Layout> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
