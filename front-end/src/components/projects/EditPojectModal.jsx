import propTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import styles from './AddProject.module.css'
import customModalStyles from './EditProjectModal.module.css'
import { MODAL_STYLES } from '../ui/modal-styles'

const TASK_STATUSES = {
  1: 'Планирана',
  2: 'Очаква одобрение',
  3: 'Одобрена',
  4: 'В изпълнение',
  5: 'Отказана',
  6: 'Изпълнена',
}

Modal.setAppElement('#root')

const EditPojectModal = ({
  id,
  onClose,
  handleEdit,
  name,
  description,
  client,
  allClients,
  experts,
  beginsAt,
  endsAt,
  status,
}) => {
  const [editedProject, setEditedProject] = useState({
    name,
    description,
    client,
    beginsAt,
    endsAt,
    status,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [projectTasks, setProjectTasks] = useState([])
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [temporaryTask, setTemporaryTask] = useState(null)
  const [isEditedSuccessfully, setIsEditedSuccessfully] = useState(false)
  const [statuses, setStatuses] = useState([])
  const [isAddingNewClient, setIsAddingNewClient] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        const [tasksResponse, statusesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/tasks/' + id),
          fetch('http://localhost:5000/api/status'),
        ])

        const tasksData = await tasksResponse.json()
        const statusesData = await statusesResponse.json()

        setProjectTasks(tasksData.tasks)
        setStatuses(statusesData.statuses)
      } catch (e) {
        console.log('There was an error fetching data', e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const toggleEditMode = (task) => {
    if (editingTaskId === task.task_id) {
      setEditingTaskId(null)
      setTemporaryTask(null)
    } else {
      setEditingTaskId(task.task_id)
      setTemporaryTask({ ...task })
    }
  }

  const saveTaskChanges = () => {
    if (editingTaskId && temporaryTask) {
      setProjectTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === editingTaskId ? temporaryTask : task
        )
      )
      setEditingTaskId(null)
      setTemporaryTask(null)
    }
  }

  const handleTemporaryChange = (field, value) => {
    setTemporaryTask((prev) => ({ ...prev, [field]: value }))
  }

  async function handleEditSubmit(e) {
    e.preventDefault()

    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/projects/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedProject.name,
          description: editedProject.description,
          client: editedProject.client,
          beginsAt: editedProject.beginsAt,
          endsAt: editedProject.endsAt,
          status: editedProject.status,
          tasks: projectTasks.map((task) => ({
            task_id: task.task_id,
            name: task.task_name,
            description: task.task_description,
            result: task.task_deliverables,
            beginsAt: task.task_begin,
            endsAt: task.task_end,
            priority: task.task_priority,
            ready: task.task_ready,
            hours: task.task_hours,
            status_id: task.status.status_id,
            expert: {
              expert_id: task.expert_id,
              expert_type: task.expert_type,
              expert_name: task.expert_name,
              expert_surname: task.expert_surname,
              expert_lastname: task.expert_lastname,
            },
          }))
        }),
      })

      const editedProjectResponse = await response.json()

      if (response.ok) {
        const {
          project_name,
          project_description,
          project_client,
          project_begin,
          project_end,
          project_status,
          projects_pay_per_hour,
          tasks
        } = editedProjectResponse.project

        setIsEditedSuccessfully(true)
        handleEdit({
          name: project_name,
          description: project_description,
          client: project_client,
          beginsAt: project_begin,
          endsAt: project_end,
          status: project_status,
          payPerHour: projects_pay_per_hour,
          tasks,
        })

      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  function getAvailableStatuses(currentProjectStatus) {
    if (currentProjectStatus === 'Нов') {
      return statuses.filter((status) => ['Нов', 'В изпълнение', 'Прекратен', 'Замразен'].includes(status.pstatus_name))
    }
    if (currentProjectStatus === 'В изпълнение') {
      return statuses.filter((status) => ['В изпълнение', 'Изпълнен', 'Прекратен', 'Замразен'].includes(status.pstatus_name))
    }
    if (currentProjectStatus === 'Прекратен' || currentProjectStatus === 'Замразен') {
      return statuses.filter((status) => status.pstatus_name === 'В изпълнение')
    }
    if (currentProjectStatus === 'Изпълнен') {
      return []
    }
    return []
  }

  if (isLoading) {
    return (
      <div className={customModalStyles.loading_overlay}>
        <ClipLoader size={50} color='gray' />
      </div>
    )
  }

  return isLoading ? (
    <div className={customModalStyles.loading_overlay}>
      <ClipLoader size={50} color="gray" />
    </div>
  ) : (
    <div>
      <Modal
        isOpen={!isLoading}
        onRequestClose={onClose}
        style={{
          content: {
            ...MODAL_STYLES.content,
            height: isEditedSuccessfully ? '40%' : '80%',
            width: isEditedSuccessfully ? '40%' : '60%',
            display: isEditedSuccessfully ? 'flex' : 'block',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            overflow: isEditedSuccessfully ? 'hidden' : 'auto',
          }
        }}
      >
        {isEditedSuccessfully ? (
          <section className={customModalStyles.edited__successfully}>
            <h2>Проектът е успешно редактиран!</h2>
            <button
              onClick={() => {
                onClose()
                setIsEditedSuccessfully(false)
                handleEdit(false)
              }}
            >
              <Link to='/projects'>
                ОК
              </Link>
            </button>
          </section>
        ) : (
          <>
            <h2 style={{ textAlign: 'center' }}>Редактиране на проект</h2>
            <form onSubmit={handleEditSubmit}>
              <div className={styles.form__control}>
                <label htmlFor='name'>Име</label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                />
              </div>
              <div className={styles.form__control}>
                <label htmlFor='description'>Описание</label>
                <textarea
                  name='description'
                  id='description'
                  rows='5'
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                />
              </div>
              <div className={styles.form__control}>
                <label htmlFor='client'>Клиент:</label>
                <select
                  name='client'
                  id='client'
                  value={isAddingNewClient ? 'addNew' : editedProject.client}
                  onChange={(e) => {
                    const selectedValue = e.target.value

                    if (selectedValue === 'addNew') {
                      setIsAddingNewClient(true)
                      setEditedProject((prev) => ({ ...prev, client: '' }))
                    } else {
                      setIsAddingNewClient(false)
                      setEditedProject((prev) => ({ ...prev, client: selectedValue }))
                    }
                  }}
                >
                  {allClients.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                  <option value='addNew'>Add New Client</option>
                </select>

                {isAddingNewClient && (
                  <input
                    type='text'
                    id='new-client'
                    name='new-client'
                    placeholder='Enter new client name'
                    value={editedProject.client}
                    minLength='3'
                    maxLength='30'
                    onChange={(e) =>
                      setEditedProject((prev) => ({ ...prev, client: e.target.value }))
                    }
                    required
                  />
                )}
              </div>
              <div className={styles.form__control}>
                <label htmlFor='beginsAt'>Начало: {editedProject.beginsAt.split('T')[0]}</label>
                <input
                  type='date'
                  id='beginsAt'
                  name='beginsAt'
                  onChange={(e) => setEditedProject({ ...editedProject, beginsAt: e.target.value })}
                  value={editedProject.beginsAt.split('T')[0]}
                  required
                />
              </div>
              <div className={styles.form__control}>
                <label htmlFor='endsAt'>Край: {editedProject.endsAt.split('T')[0]}</label>
                <input
                  type='date'
                  id='endsAt'
                  name='endsAt'
                  onChange={(e) => setEditedProject({ ...editedProject, endsAt: e.target.value })}
                  value={editedProject.endsAt.split('T')[0]}
                  required
                />
              </div>
              <div className={styles.form__control}>
                <label htmlFor='status'>Статус</label>
                <select
                  disabled={getAvailableStatuses(status).length === 0}
                  style={{ cursor: getAvailableStatuses(status).length === 0 ? 'not-allowed' : 'auto' }}
                  value={editedProject.status}
                  onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
                  name="status"
                >
                  {getAvailableStatuses(status).map((status) => (
                    <option key={status.pstatus_id} value={status.pstatus_id}>
                      {status.pstatus_name}
                    </option>
                  ))}
                </select>
              </div>
              {projectTasks.length > 0 && projectTasks.map((task) => (
                <div className={styles.all_tasks} key={task.task_id}>
                  <div className={customModalStyles.task} key={task.task_id}>
                    <div
                      style={{ marginBottom: '10px' }}
                    >
                      {editingTaskId === task.task_id ? (
                        <>
                          <label htmlFor={`task_name_${task.task_id}`}>Име</label>
                          <input
                            id={`task_name_${task.task_id}`}
                            type='text'
                            value={temporaryTask.task_name}
                            onChange={(e) =>
                              handleTemporaryChange('task_name', e.target.value)
                            }
                          />
                          <label htmlFor={`task_description_${task.task_id}`}>Описание</label>
                          <textarea
                            type='text'
                            id={`task_description_${task.task_id}`}
                            value={temporaryTask.task_description}
                            onChange={(e) =>
                              handleTemporaryChange('task_description', e.target.value)
                            }
                          />
                          <label htmlFor={`deliverables_${task.task_id}`}>Резултат:</label>
                          <input
                            type='text'
                            id={`deliverables_${task.task_id}`}
                            value={temporaryTask.task_deliverables}
                            onChange={(e) =>
                              handleTemporaryChange('task_deliverables', e.target.value)
                            }
                          />
                          <label htmlFor={`task_begin_${task.task_id}`}>Начало</label>
                          <input
                            id={`task_begin_${task.task_id}`}
                            type='date'
                            value={temporaryTask.task_begin ? temporaryTask.task_begin.split('T')[0] : ''}
                            onChange={(e) =>
                              handleTemporaryChange('task_begin', e.target.value)
                            }
                          />
                          <label htmlFor={`task_end_${task.task_end}`}>Край</label>
                          <input
                            id={`task_end_${task.task_end}`}
                            type='date'
                            value={temporaryTask.task_end ? temporaryTask.task_end.split('T')[0] : ''}
                            onChange={(e) =>
                              handleTemporaryChange('task_end', e.target.value)
                            }
                          />
                          <label htmlFor={`task_priority_${task.task_priority}`}>Приоритет</label>
                          <select
                            id={`task_priority_${task.task_priority}`}
                            value={temporaryTask.task_priority}
                            onChange={(e) =>
                              handleTemporaryChange('task_priority', e.target.value)
                            }
                          >
                            <option value='Висок'>Висок</option>
                            <option value='Среден'>Среден</option>
                            <option value='Нисък'>Нисък</option>
                          </select>
                          <label htmlFor={`task_expert${task.task_id}`}>Експерт</label>
                          <select
                            id={`task_expert${task.task_id}`}
                            value={temporaryTask.task_expert}
                            onChange={(e) =>
                              handleTemporaryChange('task_expert', e.target.value)
                            }
                          >
                            {experts.map((expert) => (
                              <option
                                key={expert.expert_id}
                                value={expert.expert_id}
                              >
                                {`${expert.expert_name} ${expert.expert_surname} ${expert.expert_lastname}`}
                              </option>
                            ))}
                          </select>
                          <label htmlFor={`status_id_${task.status}`}>Статус</label>
                          <select
                            id={`status_id_${task.status}`}
                            value={temporaryTask.status}
                            onChange={(e) =>
                              handleTemporaryChange('status', parseInt(e.target.value))
                            }
                          >
                            <option value={1}>Планирана</option>
                            <option value={2}>Очаква одобрение</option>
                            <option value={3}>Одобрена</option>
                            <option value={4}>В изпълнение</option>
                            <option value={5}>Отказана</option>
                            <option value={6}>Изпълнена</option>
                          </select>
                          <label htmlFor={`hours_${task.hours}`}>Часове</label>
                          <input
                            id={`hours_${task.hours}`}
                            type='number'
                            min='0'
                            value={temporaryTask.task_hours}
                            onChange={(e) =>
                              handleTemporaryChange('task_hours', parseInt(e.target.value) || 0)
                            }
                          />
                          <div style={{ marginTop: '10px' }}>
                            <button onClick={saveTaskChanges}>Save</button>
                            <button
                              onClick={() => toggleEditMode(task)}
                              style={{ marginLeft: '10px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3>{task.task_name}</h3>
                          <p>{task.task_description}</p>
                          <p>Резултат: {task.task_deliverables}</p>
                          <p>Приоритет: {task.task_priority}</p>
                          <p>Статус: {TASK_STATUSES[task.task_status]}</p>
                          <p>Часове: {task.task_hours}</p>
                          <p>Старт: {new Date(task.task_begin).toLocaleDateString()}</p>
                          <p>Край: {new Date(task.task_end).toLocaleDateString()}</p>
                          <button
                            onClick={() => toggleEditMode(task)}
                            style={{ marginTop: '10px' }}
                          >
                            Промяна
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className={customModalStyles.buttons}>
                <button disabled={isLoading} type='submit'>{isLoading ? 'Обработва се' : 'Потвърди'}</button>
                <button disabled={isLoading} type='button' onClick={onClose}>Отказ</button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div >
  )
}


EditPojectModal.displayName = 'EditPojectModal'

export default EditPojectModal

EditPojectModal.propTypes = {
  id: propTypes.number,
  onClose: propTypes.func,
  handleEdit: propTypes.func,
  name: propTypes.string,
  description: propTypes.string,
  client: propTypes.string,
  experts: propTypes.array,
  allClients: propTypes.array,
  beginsAt: propTypes.string,
  endsAt: propTypes.string,
  status: propTypes.string,
}
