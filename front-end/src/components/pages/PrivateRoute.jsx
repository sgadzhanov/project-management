import { Navigate } from 'react-router-dom'
import propTypes from 'prop-types'

export default function PrivateRoute({ children }) {
  const userItem = localStorage.getItem('user')

  if (!userItem) {
    return <Navigate to='/login' />
  }

  return children
}

PrivateRoute.propTypes = {
  children: propTypes.node,
}
