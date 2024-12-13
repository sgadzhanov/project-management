import propTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditPojectModal from '../projects/EditPojectModal'
import styles from './ContentCard.module.css'

export default function ContentCard({
  id,
  name,
  description,
  client,
  allClients,
  experts,
  beginsAt,
  endsAt,
  status,
  setProjects,
}) {
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const memoizedAllClients = useMemo(() => allClients, [allClients])
  const memoizedExperts = useMemo(() => experts, [experts])
  const memoizedClient = useMemo(() => client, [client])

  const onEdit = useCallback(() => {
    setIsEditing(true)
  }, []);

  const onFinishEdit = (project) => {
    if (!project) {
      setIsEditing(false)
      return
    }
    setEditedProject(project)
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/projects/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        setMessage('Възникна грешка, моля опитайте по-късно.')
      } else {
        setMessage('Проектът беше изтрит успешно!')
        setProjects((prev) => prev.filter((project) => project.project_id !== id))
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = useCallback(() => {
    console.log('Closing');

    setIsEditing(false)
  }, []);

  return (
    <>
      {isEditing ? (
        <EditPojectModal
          key={id}
          id={id}
          onClose={handleModalClose}
          handleEdit={onFinishEdit}
          name={editedProject ? editedProject.name : name}
          description={editedProject ? editedProject.description : description}
          client={editedProject ? editedProject.client : memoizedClient}
          allClients={memoizedAllClients}
          experts={memoizedExperts}
          beginsAt={editedProject ? editedProject.beginsAt : beginsAt}
          endsAt={editedProject ? editedProject.endsAt : endsAt}
          status={editedProject ? editedProject.status : status}
        />
      ) : (
        <li className={styles.card}>
          <h2 className={styles.projectName}>{id}. {editedProject ? editedProject.name : name}</h2>
          <div className={styles.details}>
            <p>
              <strong>Клиент: </strong>
              {editedProject ? editedProject.client : client}</p>
            <p>
              <strong>Срок: </strong>
              {editedProject
                ? `${new Date(editedProject.beginsAt).toLocaleDateString()} - ${new Date(editedProject.endsAt).toLocaleDateString()}`
                : `${new Date(beginsAt).toLocaleDateString()} - ${new Date(endsAt).toLocaleDateString()}`
              }
            </p>
            <p><strong>Статус:</strong> {editedProject ? editedProject.status : status}</p>
          </div>
          {message && <p style={{ color: 'salmon' }}>{message}</p>}
          <div className={styles.cardActions}>
            <button disabled={isLoading} onClick={() => navigate('/projects/' + id)}>Виж</button>
            <button disabled={['Замразен', 'Приключил', 'Прекратен'].includes(status) || isLoading} className={styles.editButton} onClick={onEdit}>Промени</button>
            <button disabled={isLoading} className={styles.deleteButton} onClick={onDelete}>Изтрий</button>
          </div>
        </li>
      )}
    </>
  )
}

ContentCard.propTypes = {
  id: propTypes.number,
  name: propTypes.string,
  description: propTypes.string,
  client: propTypes.string,
  allClients: propTypes.array,
  experts: propTypes.array,
  beginsAt: propTypes.string,
  endsAt: propTypes.string,
  status: propTypes.string,
  setProjects: propTypes.func,
}
