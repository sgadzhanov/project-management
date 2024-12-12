import { Link } from 'react-router-dom'
import styles from './App.module.css'
import Card from './components/ui/Card'

function App() {
  return (
    <>
      <main className={styles.main__container}>
        <div className={styles.cards}>
          <Link to='/projects'>
            <Card page='Проекти' />
          </Link>
          <Link to='/experts'>
            <Card page='Експерти' />
          </Link>
        </div>
      </main>
    </>
  )
}

export default App
