import { Link } from "react-router-dom"
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Упс! Страницата не е намерена.</p>
      <Link to="/" className={styles.link}>
        <button className={styles.button}>Начало</button>
      </Link>
    </div>
  )
}
