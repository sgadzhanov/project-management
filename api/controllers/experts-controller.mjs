import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

import { findProjectsRelatedToExpert } from "./projects-controller.mjs"

export async function findAllExperts(_req, res) {
  try {
    const experts = await prisma.expert.findMany()

    return res.json({ experts }).status(200)
  } catch (e) {
    console.log('There was an error finding all experts', e)
    res.status(500).json({ error: e })
  }
}

export async function findById(req, res) {
  try {
    const { id } = req.params

    const expert = await prisma.expert.findUnique({
      where: {
        expert_id: +id
      },
    })

    const projects = await findProjectsRelatedToExpert(Number(id))

    return res.status(200).json({ expert, projects })
  } catch (e) {
    console.log('There was an error', e)
    res.status(500).json({ error: e })
  }
}

export async function updateExpert(req, res) {
  try {
    const { id } = req.params
    const { expert_name, expert_surname, expert_lastname, expert_type } = req.body
    console.log({ expert_name, expert_surname, expert_lastname, expert_type });

    const updatedExpert = await prisma.expert.update({
      where: {
        expert_id: Number(id),
      },
      data: {
        expert_name,
        expert_surname,
        expert_lastname,
        expert_type,
      },
    })

    return res.status(200).json({ expert: updatedExpert })
  } catch (e) {
    console.log('There was an error updating expert', e)
    return res.status(500).json({ error: e })
  }
}

export async function addExpert(req, res) {
  try {
    const { name, surname, lastName, type } = req.body

    const newExpert = await prisma.expert.create({
      data: {
        expert_name: name,
        expert_surname: surname,
        expert_lastname: lastName,
        expert_type: type,
      },
    })

    return res.status(200).json({ expert: newExpert })
  } catch (e) {
    console.log('There was an error adding new expert', e)
    res.status(500).json({ error: e })
  }
}
