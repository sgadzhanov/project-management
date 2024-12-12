import propTypes from 'prop-types'
import styles from './Card.module.css'

export default function Card({ page, children }) {
  return (
    <section className={styles.card__wrapper}>
      <h2>Всички {page}</h2>
      {children}
    </section>
  )
}

Card.propTypes = {
  page: propTypes.string,
  children: propTypes.node,
}
