import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
  await prisma.$transaction([
    prisma.checkIn.deleteMany(),
    prisma.routine.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.user.deleteMany()
  ])
}