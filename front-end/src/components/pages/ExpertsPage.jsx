import { useEffect, useState } from 'react'
import styles from './ExpertsPage.module.css'
import { Link } from 'react-router-dom'

export default function Experts() {
  const [experts, setExperts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState(false)
  const [newExpert, setNewExpert] = useState({
    name: '',
    surname: '',
    lastName: '',
    type: 'I',
  })
  const [isUsingFilters, setIsUsingFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    surname: '',
    lastName: '',
    type: '',
  })
  const [isAddingNewExpert, setIsAddingNewExpert] = useState(false)

  useEffect(() => {
    if (experts.length > 0 && !isAddedSuccessfully) {
      return
    }
    async function fetchExperts() {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:5000/api/experts')
        const data = await response.json()

        setExperts(data.experts)
      } catch (e) {
        console.error('Error fetching experts:', e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperts()
  }, [isAddedSuccessfully])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>Loading...</div>
      </div>
    )
  }

  if (error) {
    <div className={styles.page}>
      <p>Моля опитайте по-късно.</p>
    </div>
  }

  if (isAddedSuccessfully) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', justifyContent: 'center', alignItems: 'center' }}>
          <p>
            Успешно добавихте нов експерт!
          </p>
          <button onClick={() => setIsAddedSuccessfully(false)} style={{ width: '8rem' }}>
            <Link to='/experts'>Виж всички</Link>
          </button>
        </div>
      </div>
    )
  }

  async function handleAddNewExpert(e) {
    e.preventDefault()

    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/experts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpert),
      })
      if (!response.ok) {
        setError(true)
      } else {
        setIsAddedSuccessfully(true)
      }
    } catch (e) {
      console.log('There was an error registering new expert', e)

    } finally {
      setIsLoading(false)
      setIsAddingNewExpert(false)
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setNewExpert((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleFilterChange(e) {
    const { name, value } = e.target
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function renderAddNewExpertForm() {
    return (
      <form onSubmit={handleAddNewExpert} className={styles.form}>
        <h2>Регистрирай Експерт</h2>

        <div className={styles.formGroup}>
          <label htmlFor='name'>Име</label>
          <input
            type='text'
            id='name'
            name='name'
            value={newExpert.name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='surname'>Презиме</label>
          <input
            type='text'
            id='surname'
            name='surname'
            value={newExpert.surname}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='lastName'>Фамилия</label>
          <input
            type='text'
            id='lastName'
            name='lastName'
            value={newExpert.lastName}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='type'>Тип</label>
          <select
            id='type'
            name='type'
            value={newExpert.type}
            onChange={handleInputChange}
            required
            className={styles.select}
          >
            <option value='Вътрешен'>Вътрешен</option>
            <option value='Външен'>Външен</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button className={styles.button}>
            Добави
          </button>
          <button type='buton' onClick={() => setIsAddingNewExpert(false)} className={styles.button}>
            Отказ
          </button>
        </div>
      </form>
    )
  }

  function renderFiltersSection() {
    return (
      <div className={styles.filters}>
        <h2>Филтри</h2>
        <div className={styles.filterGroup}>
          <label htmlFor='name'>Име</label>
          <input
            type='text'
            id='name'
            name='name'
            value={filters.name}
            onChange={handleFilterChange}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor='surname'>Презиме</label>
          <input
            type='text'
            id='surname'
            name='surname'
            value={filters.surname}
            onChange={handleFilterChange}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor='lastName'>Фамилия</label>
          <input
            type='text'
            id='lastName'
            name='lastName'
            value={filters.lastName}
            onChange={handleFilterChange}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor='type'>Тип</label>
          <select
            id='type'
            name='type'
            value={filters.type}
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value=''>All</option>
            <option value='I'>Вътрешен</option>
            <option value='E'>Външен</option>
          </select>
        </div>
      </div>
    )
  }

  const filteredExperts = experts.filter((expert) => {
    const matchesName = expert.expert_name?.toLowerCase().includes(filters.name.toLowerCase())

    const matchesSurname = !filters.surname || expert.expert_surname?.toLowerCase().includes(filters.surname.toLowerCase()) || !expert.expert_surname
    const matchesLastName = !filters.lastName || expert.expert_lastname?.toLowerCase().includes(filters.lastName.toLowerCase()) || !expert.expert_lastname

    const matchesType = filters.type === '' || expert.expert_type === filters.type

    return matchesName && matchesSurname && matchesLastName && matchesType
  })

  return (
    <div className={styles.page}>
      <div className={styles.expertsContainer}>
        <div className={styles.experts__header}>
          <h1>Нашите Експерти</h1>
          <div className={styles.buttons}>
            <button onClick={() => setIsUsingFilters(prev => !prev)}>{isUsingFilters ? 'Скрий Филтри' : 'Филтрирай'}</button>
            {!isAddingNewExpert && <button onClick={() => setIsAddingNewExpert(true)}>Добави Експерт</button>}
          </div>
        </div>
        {isUsingFilters && renderFiltersSection()}
        {isAddingNewExpert && renderAddNewExpertForm()}
        <div className={styles.expertList}>
          {filteredExperts.map((expert) => (
            <Link to={`/experts/${expert.expert_id}`} key={expert.expert_id} className={styles.expertCard}>
              <h2>{expert.expert_name} {expert.expert_surname} {expert.expert_lastname || ''}</h2>
              <p><strong>Номер:</strong> {expert.expert_id}</p>
              <p><strong>Тип:</strong> {expert.expert_type === 'I' ? 'Вътрешен' : 'Външен'}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
