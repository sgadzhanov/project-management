import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import styles from './AddProject.module.css'
import propTypes from 'prop-types'

const INITIAL_PROJECT_STATE = {
  name: '',
  description: '',
  client: '',
  beginsAt: '',
  endsAt: '',
  perHour: '',
  tasks: [],
}

const TASK_PRIORITIES = ['Ниска', 'Средна', 'Висока']

export default function AddProject({ onChange, onClose, clients, experts, onExpertsChange }) {
  const [projectInfo, setProjectInfo] = useState(INITIAL_PROJECT_STATE)
  const [task, setTask] = useState({ name: '', description: '', result: '', hours: 0, priority: '', expert: null })
  const [isAddingNewClient, setIsAddingNewClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState(false)
  const [newExpert, setNewExpert] = useState({ name: '', surname: '', lastName: '', type: 'I' })

  function addTask() {
    if (task.name && task.priority && task.expert) {
      setProjectInfo({
        ...projectInfo,
        tasks: [...projectInfo.tasks, task],
      })
      setTask({ name: '', description: '', result: '', priority: '', hours: 0 })
    } else {
      alert('Моля попълнете всички неоходими полета за добавяне на нова задача.')
    }
  }

  function removeTask(index) {
    const updatedTasks = [...projectInfo.tasks]
    updatedTasks.splice(index, 1)
    setProjectInfo({ ...projectInfo, tasks: updatedTasks })
  }

  function handleClientChange(e) {
    const selectedValue = e.target.value
    if (selectedValue === 'addNew') {
      setIsAddingNewClient(true)
      setProjectInfo({ ...projectInfo, client: '' })
    } else {
      setIsAddingNewClient(false)
      setProjectInfo({ ...projectInfo, client: selectedValue })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectInfo),
      })

      if (response.ok) {
        setTimeout(() => {
          setIsAddedSuccessfully(true)
          onChange(true)
          setTimeout(() => {
            setIsAddedSuccessfully(false)
          }, 5000)
        }, 100)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  if (isLoading) return <ClipLoader />

  return (
    <div className={styles.form__wrapper}>
      <form onSubmit={handleSubmit}>
        <h2>Добави нов проект</h2>
        <div className={styles.form__control}>
          <label htmlFor='name'>Име на проекта:</label>
          <input
            type='text'
            id='name'
            name='name'
            required
            onChange={e => setProjectInfo({ ...projectInfo, name: e.target.value })}
            minLength='5'
            maxLength='30'
          />
        </div>
        <div className={styles.form__control}>
          <label htmlFor='description'>Описание на проекта:</label>
          <textarea
            name='description'
            id='description'
            cols='10'
            rows='10'
            onChange={e => setProjectInfo({ ...projectInfo, description: e.target.value })}
          />
        </div>
        <div className={styles.form__control}>
          <label htmlFor='client'>Клиент:</label>
          <select
            name='client'
            id='client'
            value={isAddingNewClient ? 'addNew' : projectInfo.client}
            onChange={handleClientChange}
          >
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
            <option value='addNew'>Add New Client</option>
          </select>

          {isAddingNewClient && (
            <input
              type='text'
              id='client'
              name='client'
              placeholder='Enter new client name'
              value={projectInfo.client}
              minLength='3'
              maxLength='30'
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, client: e.target.value })
              }
              required
            />
          )}
        </div>
        <div className={styles.form__control}>
          <label htmlFor='beginsAt'>Начало:</label>
          <input
            type='date'
            id='beginsAt'
            name='beginsAt'
            onChange={(e) => setProjectInfo({ ...projectInfo, beginsAt: e.target.value })}
            required
          />
        </div>
        <div className={styles.form__control}>
          <label htmlFor='endsAt'>Край:</label>
          <input
            type='date'
            id='endsAt'
            name='endsAt'
            onChange={(e) => setProjectInfo({ ...projectInfo, endsAt: e.target.value })}
            required
          />
        </div>
        <div className={styles.form__control}>
          <label htmlFor='perHour'>Часова Ставка</label>
          <input
            required
            type='number'
            name='perHour'
            min='1'
            id='perHour'
            value={projectInfo.perHour}
            onChange={e => setProjectInfo({ ...projectInfo, perHour: e.target.value })}
          />
        </div>
        <div className={styles.tasks__container}>
          <h3>Задачи</h3>
          <div className={styles.form__control}>
            <label htmlFor='taskname'>Име на задачата</label>
            <input
              type='text'
              name='taskname'
              id='taskname'
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              required={projectInfo.tasks.length === 0}
            />
            <div className={styles.form__control}>
              <label htmlFor='task_description'>Описание на задачата</label>
              <textarea
                name='task_description'
                id='task_description'
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
            </div>
            <div className={styles.form__control}>
              <label htmlFor='task_result'>Резултат от задачата</label>
              <input
                name='task_result'
                id='task_result'
                type='text'
                value={task.result}
                onChange={(e) => setTask({ ...task, result: e.target.value })}
              />
            </div>
            <div className={styles.form__control}>
              <label htmlFor='task_priority'>Приоритет</label>
              <select
                name='task_priority'
                id='task_priority'
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                required={projectInfo.tasks.length === 0}
              >
                <option value=''>Избери</option>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.form__control}>
              <label htmlFor='hours'>
                Отработени часове
              </label>
              <input
                name='hours'
                id='hours'
                type='number'
                value={task.hours}
                onChange={(e) => setTask({ ...task, hours: e.target.value })}
                min='0'
                max='100'
              />
            </div>
            <div className={styles.experts__container}>
              <div className={styles.choose__expert}>
                <div>
                  <h2>Избери Изпълнител</h2>
                  <select
                    onChange={e => {
                      if (!e.target.value) return

                      const selectedExpertId = e.target.value
                      const selectedExpert = experts.find(expert => expert.expert_id === +selectedExpertId)

                      if (selectedExpert) {
                        setTask((prev) => ({
                          ...prev,
                          expert: selectedExpert,
                        }))
                      }
                    }}
                  >
                    <option value=''>Избери</option>
                    {experts.map(({ expert_id, expert_type, expert_name, expert_lastname }) => (
                      <option key={expert_id} value={expert_id}>
                        {`${expert_name} ${expert_lastname || ''} - ${expert_type === 'E' ? 'Външен' : 'Вътрешен'}`}
                      </option>
                    ))}
                  </select>
                </div>
                <button type='button' onClick={addTask}>
                  Добави Задача
                </button>
              </div>
              <h2>или</h2>
              <div className={styles.add__expert}>
                <h2>Добави Изпълнител</h2>
                <div className={styles.form__control}>
                  <label htmlFor='expert_name'>Име</label>
                  <input type='text' id='expert_name' name='expert_name' value={newExpert.name} onChange={e => setNewExpert((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
                <div className={styles.form__control}>
                  <label htmlFor='expert_surname'>Презиме</label>
                  <input type='text' id='expert_surname' name='expert_surname' value={newExpert.surname} onChange={e => setNewExpert((prev) => ({ ...prev, surname: e.target.value }))} />
                </div>
                <div className={styles.form__control}>
                  <label htmlFor='expert_lastname'>Фамилия</label>
                  <input type='text' id='expert_lastname' name='expert_lastname' value={newExpert.lastName} onChange={e => setNewExpert((prev) => ({ ...prev, lastName: e.target.value }))} />
                </div>
                <div className={styles.expert__actions}>
                  <div className={styles.expert_type}>
                    <div>
                      <label htmlFor='internal'>Вътрешен</label>
                      <input className={styles.checkbox} type='checkbox' name='internal' id='internal' checked={newExpert.type === 'I'} onChange={e => setNewExpert((prev) => ({ ...prev, type: e.target.checked ? 'I' : 'E' }))} />
                    </div>
                    <div>
                      <label htmlFor='external'>Външен</label>
                      <input className={styles.checkbox} type='checkbox' name='external' id='external' checked={newExpert.type === 'E'} onChange={e => setNewExpert((prev) => ({ ...prev, type: e.target.checked ? 'E' : 'I' }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start' }}>
                    <button
                      type='button'
                      onClick={() => {
                        onExpertsChange((prev) => {
                          const maxId = prev.reduce((max, expert) => expert.expert_id > max ? expert.expert_id : max, 0)
                          return (
                            [...prev, {
                              expert_id: maxId + 1,
                              expert_name: newExpert.name,
                              expert_surname: newExpert.surname,
                              expert_lastname: newExpert.lastName,
                              expert_type: newExpert.type
                            }]
                          )
                        })
                        setNewExpert({ name: '', surname: '', lastName: '', type: 'I' })
                      }}>Добави</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {projectInfo.tasks.length > 0 && (
            <ul className={styles.tasks}>
              {projectInfo.tasks.map((t, index) => (
                <li className={styles.task} key={index}>
                  <p>
                    {t.name} - {t.priority}
                  </p>
                  <button type='button' onClick={() => removeTask(index)}>
                    Премахни
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.buttons}>
          {isAddedSuccessfully ? <p className={styles.success__message}>Проектът е добавен успешно!</p> : (
            <>
              <button type='submit' disabled={isLoading}>Добави Проект</button>
              <button type='button' onClick={onClose} disabled={isLoading}>Затвори</button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

AddProject.propTypes = {
  onClose: propTypes.func,
  onChange: propTypes.func,
  clients: propTypes.array,
  experts: propTypes.array,
  onExpertsChange: propTypes.func,
}
