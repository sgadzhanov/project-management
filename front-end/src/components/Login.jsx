import { useState } from 'react'
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (username.trim().length < 6) {
      setValidation((prevState) => ({
        ...prevState,
        username: 'Username must be at least 6 characters long',
      }))
      return
    }

    if (password.trim().length < 6) {
      setValidation((prevState) => ({
        ...prevState,
        password: 'Password must be at least 6 characters long',
      }))
      return
    }

    let response

    try {
      setIsLoading(true)
      response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })
      const json = await response.json()

      if (!response.ok) {
        setError(json.error)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
      if (response.ok) {
        localStorage.setItem('user', username)
        navigate('/')
      }
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Вход</h2>
        <div className={styles.inputGroup}>
          {validation.username && <p className={styles.error}>{validation.username}</p>}
          <label htmlFor='username' className={styles.label}>Потребителско име</label>
          <input
            id='username'
            type='text'
            className={styles.input}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setValidation((prevState) => ({
                ...prevState,
                username: '',
              }))
            }}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          {validation.password && <p className={styles.error}>{validation.password}</p>}
          <label htmlFor='password' className={styles.label}>Парола</label>
          <input
            id='password'
            type='password'
            className={styles.input}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setValidation((prevState) => ({
                ...prevState,
                password: '',
              }))
            }}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type='submit' disabled={isLoading} className={styles.button}>{isLoading ? 'Моля изчакайте...' : 'Вход'}</button>
      </form>
    </div>
  )
}
