import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export async function login(req, res) {
  try {
    const { username, password } = req.body
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    })
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    return res.status(200).json({ message: 'Success!' })
  } catch (e) {
    console.log('There was an error', e)
    res.status(500).json({ error: e })
  }
}
