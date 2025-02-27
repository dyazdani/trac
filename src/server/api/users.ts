import express from "express";
import excludePassword from "../../utils/excludePassword.js";
import prisma from "../../utils/test/prisma.js";
import requireUser from "../../utils/requireUser.js";
import formatStatusReportMessage from "../../utils/formatStatusReportMessage.js";
import { CreateHabitReqBody, CreateGoalReqBody, UpdateHabitReqBody, UpdateGoalReqBody, statusReportsPostReqBody } from "../../types/index.js";
import nodemailer from 'nodemailer';
import { Knock } from "@knocklabs/node";
import getNodemailerTransporter from "../../utils/getNodemailerTransporter.js";

const usersRouter = express.Router();

const knock = new Knock(process.env.KNOCK_API_KEY);

// GET /api/users
usersRouter.get("/", async (req, res, next): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.send({users: users.map(user => ({user: excludePassword(user)}))});
    } catch (e) {
        next(e);
    }
})

// GET /api/users
usersRouter.get("/", async (req, res, next): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: email,
            },
        }); 

        res.send({user});
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
                },
                statusReports: true
            }
        })
        res.send({ habits})
    } catch(e) {
        next(e)
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
                },
                statusReports: true
            }
        })
        res.send({ habit})
    } catch(e) {
        next(e)
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
                checkInDay,
                scheduleId,
                goalId
            }: CreateHabitReqBody = req.body

            // Create Habit
            const ownerId = Number(req.params.id);

            const habit = await prisma.habit.create({
                data: {
                    name,
                    ownerId,
                    scheduleId,
                    goalId
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

// PUT /api/users/:id/habits
usersRouter.put("/:id/habits", requireUser, async (req, res, next) => {
    try {
        const habitId = Number(req.body.habitId)
        
        const { 
            name, 
            datesCompleted, 
            routineDays, 
            checkInDay,
            scheduleId 
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
                datesCompleted,
                scheduleId
            }
        })

        res.send({habit, routine, checkIn});
    } catch (e) {
        next(e);
    }
})


// DELETE /api/users/:id/habits/:habitId
usersRouter.delete("/:id/habits/:habitId", requireUser, async (req, res, next): Promise<void> => {
    const ownerId = Number(req.params.id);
    const habitId = Number(req.params.habitId);
    try {
        const habit = await prisma.habit.delete({
            where: {
                ownerId: ownerId,
                id: habitId 
            }
        })
        res.send({ habit })
    } catch(e) {
        next(e)
    }
})


// POST /api/users/:id/habits/:habitId/statusReports
usersRouter.post("/:id/habits/:habitId/statusReports", requireUser, async (req, res, next): Promise<void> => {
    try {
        const { 
            user, 
            habitName, 
            emails, 
            message, 
            checkInDate 
        }: statusReportsPostReqBody = req.body
        
        const formattedMessage = formatStatusReportMessage(message);
        
        const statusReportEmail = {
          bcc: emails,
          subject: `Check-In Report for ${user} 📈`,
          text: message,
          html: `<h1>${habitName}</h1>
            ${formattedMessage}`,
        };

        if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
            const transporter = getNodemailerTransporter(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

            transporter.verify(function (error, success) {
                if (error) {
                console.log(error);
                } else {
                console.log("Server is ready to take our messages");
                }
            });
            
            transporter.sendMail(statusReportEmail);
        } else {
            throw new Error("Authentication for Nodemailer failed. Environment variables for email service username and password not defined.")
        }        

        const habitId = Number(req.params.habitId)
        const statusReport = await prisma.statusReport.create({
            data: {
                recipientEmails: emails,
                content: message,
                checkInDate,
                habitId
            }
        })
        
        res.send({status: "Message Sent", statusReport});
    } catch(e) {
        next(e)
    }
})

// GET /api/users/:id/habits/:habitId/statusReports
usersRouter.get("/:id/habits/:habitId/statusReports", requireUser, async (req, res, next): Promise<void> => {
    try {
        const statusReports = await prisma.habit.findUnique({
            where: {
                id: Number(req.params.habitId),
                ownerId: Number(req.params.id)
            }, 
            select: {
                statusReports: true
            }
        });

        res.send({ statusReports })
    } catch (e) {
        next(e);
    }
})

// GET /api/users/:id/schedules
usersRouter.get("/:id/schedules", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            const userId = String(req.params.id)
            const { entries: schedules } = await knock.users.getSchedules(userId)

            res.send({ schedules })
        } catch (e) {
            next(e);
        }
     }
})

// POST /api/users/:id/goals
usersRouter.post("/:id/goals", requireUser, async (req, res, next): Promise<void> => {
    if (req.user) {
        try {
            const ownerId = Number(req.params.id)
            const { 
                name,
                dueDate
            }: CreateGoalReqBody = req.body

            console.log(prisma);

            const goal = await prisma.goal.create({
                data: {
                    name,
                    dueDate,
                    isCompleted: false,
                    isCanceled: false,
                    ownerId
                }
            })

            const habits = await prisma.habit.findMany({
                where: {
                    goalId: goal.id
                },
                include: {
                    routine: true,
                    checkIn: {
                        select: {
                            dayOfTheWeek: true
                        }
                    },
                    statusReports: true
                }
            })

            res.send({ 
                goal: {
                    ...goal,
                    habits
                }   
            });
        } catch (e) {
            next(e);
        }
    }
})

// GET /api/users/:id/goals
usersRouter.get("/:id/goals", requireUser, async (req, res, next): Promise<void> => {
    const ownerId = Number(req.params.id)
    try {
        const goals = await prisma.goal.findMany({
            where: {
                ownerId: ownerId
            },
            include: {
                habits: {
                    include: {
                        routine: true,
                        checkIn: {
                            select: {
                                dayOfTheWeek: true
                            }
                        },
                        statusReports: true
                    }
                }
            }
        })
        res.send({ goals })
    } catch(e) {
        next(e)
    }
})

// PUT /api/users/:id/goals/:goalId
usersRouter.put("/:id/goals/:goalId", requireUser, async (req, res, next) => {
    try {
        const ownerId = Number(req.params.id)
        const goalId = Number(req.params.goalId)
        const { 
            name,
            dueDate,
            isCompleted,
            isCanceled
        }:UpdateGoalReqBody = req.body

        const habits = await prisma.habit.findMany({
            where: {
                goalId
            },
            include: {
                routine: true,
                checkIn: {
                    select: {
                        dayOfTheWeek: true
                    }
                },
                statusReports: true
            }
        })

        const goal = await prisma.goal.update({
            where: {
                ownerId,
                id: goalId
            },
            data: {
                name,
                dueDate,
                isCompleted,
                isCanceled
            }
        })

        res.send({ 
            goal: {
                ...goal,
                habits
            }   
        });
    } catch (e) {
        next(e);
    }
})

// DELETE /api/users/:id/goals/:goalId
usersRouter.delete("/:id/goals/:goalId", requireUser, async (req, res, next): Promise<void> => {
    const ownerId = Number(req.params.id);
    const goalId = Number(req.params.goalId);
    try {
        const habits = await prisma.habit.findMany({
            where: {
                goalId
            },
            include: {
                routine: true,
                checkIn: {
                    select: {
                        dayOfTheWeek: true
                    }
                },
                statusReports: true
            }
        })

        const goal = await prisma.goal.delete({
            where: {
                ownerId: ownerId,
                id: goalId 
            }
        })
        
        res.send({ 
            goal: {
                ...goal,
                habits
            }   
        });
    } catch(e) {
        next(e)
    }
})

export default usersRouter;


