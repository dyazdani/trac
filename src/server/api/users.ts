import express from "express";
import excludePassword from "../../utils/excludePassword.js";
import prisma from "../../utils/test/prisma.js";
import requireUser from "../../utils/requireUser.js";
import { createHabitReqBody } from "../../types/index.js";

const usersRouter = express.Router();

// GET /api/users
usersRouter.get("/", requireUser, async (req, res, next): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.send({users: users.map(user => ({user: excludePassword(user)}))});
    } catch (e) {
        next(e);
    }
})

// GET /api/users/:id/habits
usersRouter.get("/:id/habits", requireUser, async (req, res, next): Promise<void> => {
    const ownerId = Number(req.params.id)
    try {
        const habits = await prisma.habit.findMany({
            where: {
                ownerId: ownerId
            }
        })
        res.send({ habits})
    } catch(e) {

    }
})

// POST /api/users/:id/habits
usersRouter.post("/:id/habits", requireUser, async (req, res, next): Promise<void> => {
    if (req.user) {
        try {
            // TODO: There is potentially a more concise way to write this endpoint:  https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes
            const { 
                name,
                routineDays, 
                checkInDay
            }: createHabitReqBody = req.body

            // Create Habit
            const ownerId = Number(req.params.id);

            const habit = await prisma.habit.create({
                data: {
                    name,
                    ownerId,
                }
            });

            // Create Routine associated with Habit
            const routine = await prisma.routine.create({
                data: {
                    habitId: habit.id, 
                    ...routineDays
                }
            })

            // Create CheckIn associated with Habit
            const checkIn = await prisma.checkIn.create({
                data: {
                    habitId: habit.id, 
                    dayOfTheWeek: checkInDay
                }
            })

            res.send({ habit });
        } catch (e) {
            next(e);
        }
    }

})

export default usersRouter;