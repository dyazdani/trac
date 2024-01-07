import express from "express";
import excludePassword from "../../utils/excludePassword.js";
import prisma from "../../utils/test/prisma.js";
import requireUser from "../../utils/requireUser.js";
import { CreateHabitReqBody, RoutineDays, UpdateHabitReqBody } from "../../types/index.js";

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
            },
            include: {
                routine: true,
                checkIn: {
                    select: {
                        dayOfTheWeek: true
                    }
                }
            }
        })
        res.send({ habits})
    } catch(e) {

    }
})

// GET /api/users/:id/habits/:habitId
usersRouter.get("/:id/habits/:habitId", requireUser, async (req, res, next): Promise<void> => {
    const ownerId = Number(req.params.id)
    const habitId = Number(req.params.habitId)

    try {
        const habit = await prisma.habit.findUnique({
            where: {
                ownerId: ownerId,
                id: habitId
            },
            include: {
                routine: true,
                checkIn: {
                    select: {
                        dayOfTheWeek: true
                    }
                }
            }
        })
        res.send({ habit})
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
            }: CreateHabitReqBody = req.body

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

// PUT /api/users/:id/habits
usersRouter.put("/:id/habits", requireUser, async (req, res, next) => {
    try {
        const habitId = Number(req.body.habitId)
        
        const { 
            name, 
            datesCompleted, 
            routineDays, 
            checkInDay 
        }: UpdateHabitReqBody = req.body

        // Update Routine associated with Habit
        const routine = await prisma.routine.update({
            where: {
                habitId: habitId
            },
            data: {
                ...routineDays
            }
        })

        // Update CheckIn associated with Habit
        const checkIn = await prisma.checkIn.update({
            where: {
                habitId: habitId
            },
            data: {
                dayOfTheWeek: checkInDay
            }
        })

        // Update non-relational fields on Habit
        const habit = await prisma.habit.update({
            where: {
                id: habitId
            },
            data: {
                name,
                datesCompleted
            }
        })

        res.send({habit, routine, checkIn});
    } catch (e) {
        next(e);
    }
})