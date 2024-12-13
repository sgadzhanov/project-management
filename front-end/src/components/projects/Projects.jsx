import { useEffect, useState } from 'react'
import styles from './Projects.module.css'
import ContentCard from '../ui/ContentCard'
import AddProject from './AddProject'
import { ClipLoader } from 'react-spinners'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [experts, setExperts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [toggleForm, setToggleForm] = useState(false)
  const [projectsChanged, setProjectsChanged] = useState(false)

  const [searchId, setSearchId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchStartDate, setSearchStartDate] = useState('')
  const [searchEndDate, setSearchEndDate] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [toggleFilters, setToggleFilters] = useState(false)

  const clients = projects.reduce((acc, project) => {
    if (!acc.includes(project.project_client)) {
      acc.push(project.project_client)
    }
    return acc
  }, [])

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:5000/api/projects')
        const projects = await response.json()

        setProjects(projects.projects)
      } catch (e) {
        console.log('There was an error fetching projects', e)
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchExperts() {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:5000/api/experts')
        const experts = await response.json()

        setExperts(experts.experts)
      } catch (e) {
        console.log('There was an error fetching experts', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
    fetchExperts()
  }, [projectsChanged])

  function handleCloseForm() {
    setToggleForm(false)
  }

  const filteredProjects = projects.filter((project) => {
    return (
      (!searchId || project.project_id.toString().includes(searchId)) &&
      (!searchName || project.project_name.toLowerCase().includes(searchName.toLowerCase())) &&
      (!searchStartDate || new Date(project.project_begin) >= new Date(searchStartDate)) &&
      (!searchEndDate || new Date(project.project_end) <= new Date(searchEndDate)) &&
      (!searchStatus || project.project_status.toLowerCase().includes(searchStatus.toLowerCase()))
    )
  })

  return isLoading ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <ClipLoader />
    </div>
  ) : (
    <div className={styles.projects__container}>
      {toggleForm ? (
        <AddProject
          onClose={handleCloseForm}
          clients={clients}
          experts={experts}
          onChange={setProjectsChanged}
          onExpertsChange={setExperts}
        />
      ) : (
        <div className={styles.buttons}>
          <button onClick={() => setToggleForm((prev) => !prev)}>Добави Проект</button>
          <button onClick={() => setToggleFilters((prev) => !prev)}>{toggleFilters ? 'Затвори Филтри' : 'Филтрирай'}</button>
        </div>
      )}

      {toggleFilters && (
        <>
          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Търси по ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Търси по име"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <input
              type="date"
              placeholder="Начална дата"
              value={searchStartDate}
              onChange={(e) => setSearchStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="Крайна дата"
              value={searchEndDate}
              onChange={(e) => setSearchEndDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Търси по статус"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            />
          </div>
        </>
      )}

      <ul className={styles.projects__list}>
        {filteredProjects.map((project) => (
          <ContentCard
            key={project.project_id + project.project_name}
            id={project.project_id}
            name={project.project_name}
            description={project.project_description}
            client={project.project_client}
            allClients={clients}
            experts={experts}
            beginsAt={project.project_begin}
            endsAt={project.project_end}
            status={project.project_status}
            setProjects={setProjects}
          />
        ))}
      </ul>
    </div>
  )
}
