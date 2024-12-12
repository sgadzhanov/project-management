import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './ExpertDetails.module.css'

export default function ExpertDetails() {
  const { id } = useParams()
  const [expert, setExpert] = useState(null)
  const [updatedExpert, setUpdatedExpert] = useState({
    expert_name: '',
    expert_surname: '',
    expert_lastname: '',
    expert_type: 'I',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatedSuccessfully, setIsUpdatedSuccessfully] = useState(false)

  useEffect(() => {
    async function fetchExpertDetails() {
      try {
        setIsLoading(true)
        const response = await fetch(`http://localhost:5000/api/experts/${id}`)
        const data = await response.json()

        setExpert({
          ...data.expert,
          projects: data.projects,
        })
      } catch (e) {
        console.error('Error fetching expert details:', e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpertDetails()
  }, [id, isUpdatedSuccessfully])

  if (isLoading) {
    return (
      <div className={styles.expertDetailsContainer}>
        <div className={styles.loader}>
          Loading...
        </div>
      </div>
    )
  }

  if (!expert?.expert_id) {
    return (
      <div className={styles.expertDetailsContainer}>
        <div className={styles.error}>Expert not found.</div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={styles.expertDetailsContainer}>
        <div className={styles.error}>Упс! Моля опитайте по-късно.</div>
      </div>
    )
  }

  if (isUpdatedSuccessfully) {
    return (
      <div className={styles.expertDetailsContainer}>
        <div className={styles.success}>Успешно редактиране на експерт!</div>
        <button onClick={() => setIsUpdatedSuccessfully(false)}>
          OK
        </button>
      </div>
    )
  }

  async function handleUpdateExpert(e) {
    e.preventDefault()

    try {
      setIsLoading(true)
      console.log({ updatedExpert });
      const response = await fetch('http://localhost:5000/api/experts/' + expert.expert_id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpert),
      })

      if (!response.ok) {
        setHasError(true)
      } else if (response.ok) {
        setIsUpdatedSuccessfully(true)
        setIsUpdating(false)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  function renderUpdateExpertDetails() {
    return (
      <form onSubmit={handleUpdateExpert}>
        <div className={styles.form__control}>
          <label htmlFor='name'>Име</label>
          <input
            type='text'
            placeholder='Име'
            id='name'
            value={updatedExpert.expert_name}
            onChange={e => setUpdatedExpert(prev => ({ ...prev, expert_name: e.target.value }))}
          />
        </div>
        <div className={styles.form__control}>
          <label htmlFor='surname'>Презиме</label>
          <input
            type='text'
            placeholder='Презиме'
            id='surname'
            value={updatedExpert.expert_surname}
            onChange={e => setUpdatedExpert(prev => ({ ...prev, expert_surname: e.target.value }))}
          />
        </div>
        <div className={styles.form__control}>
          <label htmlFor='lastname'>Фамилия</label>
          <input
            type='text'
            id='lastname'
            placeholder='Фамилия'
            value={updatedExpert.expert_lastname}
            onChange={e => setUpdatedExpert(prev => ({ ...prev, expert_lastname: e.target.value }))}
          />
        </div>
        <div className={styles.expert__actions}>
          <div className={styles.expert__type}>
            <div>
              <label htmlFor='internal'>Вътрешен</label>
              <input
                type='checkbox'
                id='internal'
                checked={updatedExpert.expert_type === 'I'}
                onChange={e => setUpdatedExpert(prev => ({
                  ...prev,
                  expert_type: e.target.checked ? 'I' : 'E',
                }))}
              />
            </div>
            <div>
              <label htmlFor='external'>Външен</label>
              <input
                type='checkbox'
                id='external'
                checked={updatedExpert.expert_type === 'E'}
                onChange={e => setUpdatedExpert(prev => ({
                  ...prev,
                  expert_type: e.target.checked ? 'E' : 'I',
                }))}
              />
            </div>
          </div>
          <div className={styles.buttons}>
            <button disabled={isLoading}>Запази</button>
            <button disabled={isLoading} type='button' onClick={() => setIsUpdating(false)}>Отказ</button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className={styles.expertDetailsContainer}>
      <div className={styles.expert__info}>
        <h1>Информация за Експерт</h1>
        {!isUpdating && <button onClick={() => setIsUpdating(true)}>Промени</button>}
      </div>
      <div className={styles.expertCard} style={{ margin: '2rem auto', width: '70%'}}>
        {isUpdating ? renderUpdateExpertDetails() : (
          <>
            <h2>{expert.expert_name} {expert.expert_surname} {expert.expert_lastname || ''}</h2>
            <p><strong>ID:</strong> {expert.expert_id}</p>
            <p><strong>Тип:</strong> {expert.expert_type === 'E' ? 'Вътрешен' : 'Външен'}</p>
          </>
        )}
      </div>

      {expert.projects.length > 0 ? (
        <div className={styles.expertProjects}>
          <h2>Проекти</h2>
          <div className={styles.projectsContainer}>
            {expert.projects.map((project) => (
              <div key={project.project_id} className={styles.projectCard}>
                <h3>{project.project_name}</h3>
                <p><strong>Описание:</strong> {project.project_description}</p>
                <p><strong>Статус:</strong> {project.project_status}</p>
                <p><strong>Начало:</strong> {new Date(project.project_begin).toLocaleDateString()}</p>
                <p><strong>Край:</strong> {new Date(project.project_end).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No projects found for this expert.</p>
      )}
    </div>
  )
}
