import styles from './Page.module.css'
import Projects from '../projects/Projects'

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <Projects />
    </main>
  )
}
