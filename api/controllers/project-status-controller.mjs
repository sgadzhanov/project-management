import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function findAllProjectStatuses(_req, res) {
  try {
    const statuses = await prisma.projectStatus.findMany()
    
    return res.status(200).json({ statuses })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'There was an error finding all statuses.' })
  }
}