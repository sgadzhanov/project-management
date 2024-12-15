import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = localStorage.getItem('user')

  function renderNavLinks() {
    if (user) {
      return (
        <ul className={styles.main__header_list}>
          <div className={styles.nav__links}>
            <Link to='/projects'>
              <li>Проекти</li>
            </Link>
            <Link to='/experts'>
              <li>Експерти</li>
            </Link>
          </div>
          <Link onClick={() => {
            localStorage.removeItem('user')
            navigate('/')
          }}>
            <li className={styles.logout__button}>Изход</li>
          </Link>
        </ul>
      )
    }
    if (pathname === '/login') {
      return null
    }
    return (
      <ul className={styles.main__header_list}>
        <Link to='/login'>
          <li>Вход</li>
        </Link>
      </ul>
    )
  }

  return (
    <header className={styles.main__header}>
      <Link to='/'>
        <h2>Project Management</h2>
      </Link>
      {renderNavLinks()}
    </header >
  )
}
