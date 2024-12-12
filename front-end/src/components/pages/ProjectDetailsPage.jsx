import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './ProjectDetailsPage.module.css'

export default function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjectData() {
      try {
        setIsLoading(true)

        const projectResponse = await fetch(`http://localhost:5000/api/projects/${id}`)
        const projectData = await projectResponse.json()
        setProject(projectData.project)

        const tasksResponse = await fetch(`http://localhost:5000/api/tasks/` + id)
        const tasksData = await tasksResponse.json()

        setTasks(tasksData.tasks)
      } catch (error) {
        console.error('Error fetching project data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectData()
  }, [id])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={styles.projectDetails}>
        <p>Моля изчакайте...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className={styles.projectDetails}>
        <p>Проктът не бе намерен. Моля опитайте отново по-късно.</p>
      </div>
    )
  }

  const totalTasks = tasks.length
  const totalWorkedHours = tasks.reduce((sum, task) => sum + task.task_hours, 0)
  const expenses = totalWorkedHours * project.project_pay_per_hour

  const calculateDaysLeft = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const diff = (end - today) / (1000 * 60 * 60 * 24) // Convert ms to days
    return Math.ceil(diff)
  }

  const calculateDelay = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const diff = (today - end) / (1000 * 60 * 60 * 24) // Convert ms to days
    return diff > 0 ? Math.ceil(diff) : 0
  }

  return (
    <div className={styles.projectDetails}>
      <h1>{project.project_name}</h1>
      <p><strong>Описание:</strong> {project.project_description}</p>
      <p><strong>Клиент:</strong> {project.project_client}</p>
      <p><strong>Начална дата:</strong> {new Date(project.project_begin).toLocaleDateString()}</p>
      <p><strong>Крайна дата:</strong> {new Date(project.project_end).toLocaleDateString()}</p>
      <p><strong>Статус:</strong> {project.ProjectStatus.pstatus_name}</p>
      <p><strong>Цена за час:</strong> ${project.project_pay_per_hour.toFixed(2)}</p>

      <h2>Числа за проекта</h2>
      <div className={styles.projectSummary}>
        <div>
          <strong>Общо задачи</strong>
          {totalTasks}
        </div>
        <div>
          <strong>Общо часове работа</strong>
          {totalWorkedHours} hours
        </div>
        <div>
          <strong>Разходи</strong>
          ${expenses.toFixed(2)}
        </div>
      </div>

      {tasks.length > 0 && (
        <>
          <h2>Задачи</h2>
          <ul className={styles.taskList}>
            {tasks.map((task) => {
              const daysLeft = calculateDaysLeft(task.task_end)
              const delay = calculateDelay(task.task_end)

              return (
                <li key={task.task_id} className={styles.task}>
                  <h3>{task.task_name}</h3>
                  <p><strong>Описание:</strong> {task.task_description}</p>
                  <p><strong>Резултат:</strong> {task.task_deliverables}</p>
                  <p><strong>Експерт:</strong> {task.expert.expert_name} {task.expert.expert_surname}</p>
                  <p><strong>Приоритет:</strong> {task.task_priority}</p>
                  <p><strong>Статус:</strong> {task.status.status_name}</p>
                  <p><strong>Начало:</strong> {new Date(task.task_begin).toLocaleDateString()}</p>
                  <p><strong>Край:</strong> {new Date(task.task_end).toLocaleDateString()}</p>
                  <p><strong>Часове работа:</strong> {task.task_hours} hours</p>
                  {daysLeft > 0 && <p><strong>Оставащо време:</strong> {daysLeft} дни</p>}
                  {delay > 0 && <p className={styles.delay}><strong>Закъснение:</strong> {delay} days</p>}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
