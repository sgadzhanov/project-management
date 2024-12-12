import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function findAllTasksForProject(req, res) {
  try {
    const { id } = req.params

    const projectTasks = await prisma.projectTask.findMany({
      where: {
        project_id: Number(id),
      },
      include: {
        expert: true,
        status: true,
      }
    })

    return res.status(200).json({ tasks: projectTasks })

  } catch (e) {
    console.log('There was an error', e)
    res.status(500).json({ error: e })
  }
}
