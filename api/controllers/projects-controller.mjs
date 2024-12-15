import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function findAllProjects(_req, res) {
  const projects = await prisma.project.findMany({
    include: {
      ProjectStatus: true,
    }
  })

  const formattedProjects = projects.map((project) => ({
    ...project,
    project_status: project.ProjectStatus?.pstatus_name || null,
  }))

  return res.json({ projects: formattedProjects }).status(200)
}

export async function findProjectById(req, res) {
  try {
    const { id } = req.params

    const project = await prisma.project.findUnique({
      where: {
        project_id: Number(id),
      },
      include: {
        ProjectStatus: true,
      },
    })

    const formattedProject = {
      ...project,
      project_status: project.ProjectStatus?.pstatus_name || null,
    }

    return res.json({ project: formattedProject }).status(200)
  } catch (e) {
    console.log('There was an error', e)
    return res.status(500).json({ error: 'There was an error finding the project.' })
  }
}

export async function createProject(req, res) {
  try {
    const { name, description, client, beginsAt, endsAt, tasks, perHour } = req.body

    const initialProjectStatus = await prisma.projectStatus.findFirst({
      where: {
        pstatus_name: 'Нов',
      },
    })

    const project = await prisma.project.create({
      data: {
        project_name: name,
        project_description: description,
        project_begin: new Date(beginsAt),
        project_end: new Date(endsAt),
        project_client: client,
        project_pay_per_hour: +perHour,
        ProjectStatus: {
          connect: { pstatus_id: initialProjectStatus.pstatus_id },
        },
      },
    })
    const allTasks = []

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]

      let newExpert = await prisma.expert.findUnique({
        where: {
          expert_id: task.expert.expert_id,
        },
      })

      if (!newExpert) {
        newExpert = await prisma.expert.create({
          data: {
            expert_name: task.expert.expert_name,
            expert_surname: task.expert.expert_surname,
            expert_lastname: task.expert.expert_lastname,
            expert_type: task.expert.expert_type,
          },
        })
      }

      const initialTaskStatus = await prisma.taskStatus.findFirst({
        where: {
          status_name: 'Планирана',
        },
      })

      const newTask = await prisma.projectTask.create({
        data: {
          task_begin: new Date(beginsAt).toISOString(),
          task_end: new Date(endsAt).toISOString(),
          task_deliverables: task.result,
          task_name: task.name,
          task_priority: task.priority,
          task_description: task.description,
          task_ready: 0,
          task_hours: null,
          expert: {
            connect: { expert_id: newExpert.expert_id }, // Connect the existing expert
          },
          project: {
            connect: { project_id: project.project_id },
          },
          status: {
            connect: { status_id: initialTaskStatus.status_id }, // Link to the existing TaskStatus
          },
        },
      })

      allTasks.concat(newTask)
    }

    return res.json({ project }).status(201)
  } catch (e) {
    console.log('There was an error', e)
    return res.json({ error: e }).status(500)
  }
}

export async function editProject(req, res) {
  try {
    const { id } = req.params
    const { name, description, client, beginsAt, endsAt, tasks, status } = req.body

    const existingProject = await prisma.project.findUnique({
      where: {
        project_id: Number(id),
      },
    })

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' })
    }

    let statusFound

    statusFound = await prisma.projectStatus.findFirst({
      where: {
        pstatus_name: status,
      },
    })
    if (!statusFound) {
      statusFound = await prisma.projectStatus.findUnique({
        where: {
          pstatus_id: +status,
        },
      })
    }

    const findProjectStatus = await prisma.projectStatus.findUnique({
      where: {
        pstatus_id: statusFound.pstatus_id,
      },
    })

    const updatedProject = await prisma.project.update({
      where: {
        project_id: Number(id),
      },
      data: {
        project_name: name,
        project_description: description,
        project_client: client,
        project_begin: new Date(beginsAt),
        project_end: new Date(endsAt),
        ProjectStatus: status ? { connect: { pstatus_id: findProjectStatus.pstatus_id } } : undefined,
      },
    })

    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        let expert = await prisma.expert.findUnique({
          where: {
            expert_id: task.expert.expert_id,
          },
        })

        if (!expert) {
          expert = await prisma.expert.create({
            data: {
              expert_name: task.expert.expert_name,
              expert_surname: task.expert.expert_surname,
              expert_lastname: task.expert.expert_lastname,
              expert_type: task.expert.expert_type,
            },
          })
        }

        if (task.task_id) {
          await prisma.projectTask.update({
            where: { task_id: task.task_id },
            data: {
              task_begin: new Date(task.beginsAt),
              task_end: new Date(task.endsAt),
              task_deliverables: task.result,
              task_name: task.name,
              task_priority: task.priority,
              task_description: task.description,
              task_ready: task.ready || 0,
              task_hours: task.hours || null,
              expert: {
                connect: { expert_id: expert.expert_id },
              },
              status: {
                connect: { status_id: task.status_id },
              },
            },
          })

        } else {
          const initialTaskStatus = await prisma.taskStatus.findFirst({
            where: {
              status_name: 'Планирана',
            },
          })
          await prisma.projectTask.create({
            data: {
              task_begin: new Date(task.beginsAt),
              task_end: new Date(task.endsAt),
              task_deliverables: task.result,
              task_name: task.name,
              task_priority: task.priority,
              task_description: task.description,
              task_ready: task.ready || 0,
              task_hours: task.hours || null,
              expert: {
                connect: { expert_id: expert.expert_id },
              },
              project: {
                connect: { project_id: updatedProject.project_id },
              },
              status: {
                connect: { status_id: initialTaskStatus.status_id },
              },
            },
          })
        }
      }
    }
    const projectTasks = await prisma.projectTask.findMany({
      where: {
        project_id: updatedProject.project_id,
      },
    })
    return res.status(200).json({
      project: {
        ...updatedProject,
        tasks: projectTasks,
        project_status: findProjectStatus.pstatus_name,
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'An error occurred while updating the project.' })
  }
}

export async function findProjectsRelatedToExpert(expertId) {
  try {
    const allProjects = await prisma.project.findMany({
      include: {
        tasks: {
          where: {
            expert_id: expertId,
          },
        },
      },
    })

    return allProjects.filter((project) => project.tasks.length > 0)
  } catch (e) {
    console.log('There was an error', e)
    return res.status(500).json({ error: 'There was an error finding the projects for expert' + expertId })
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params

    await prisma.projectTask.deleteMany({
      where: {
        project_id: Number(id),
      },
    })

    const project = await prisma.project.delete({
      where: {
        project_id: Number(id),
      },
    })

    return res.json({ project }).status(200)
  } catch (e) {
    console.log('There was an error', e)
    return res.status(500).json({ error: 'There was an error deleting the project.' })
  }
}
