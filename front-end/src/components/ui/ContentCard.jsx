import { useCallback, useMemo, useState } from 'react'
import styles from './ContentCard.module.css'
import propTypes from 'prop-types'
import EditPojectModal from '../projects/EditPojectModal'
import { useNavigate } from 'react-router-dom'

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

  const onDelete = useCallback(() => {
    setProjects((prev) => prev.filter((project) => project.project_id !== id))
  }, [id])

  const handleModalClose = useCallback(() => {
    console.log('Closing');

    setIsEditing(false)
  }, []);

  return (
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
      <div className={styles.cardActions}>
        {isEditing && (
          <EditPojectModal
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
        )}
        <button onClick={() => navigate('/projects/' + id)}>Виж</button>
        <button disabled={['Замразен', 'Приключил', 'Прекратен'].includes(status)} className={styles.editButton} onClick={onEdit}>Промени</button>
        <button className={styles.deleteButton} onClick={onDelete}>Изтрий</button>
      </div>
    </li >
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
