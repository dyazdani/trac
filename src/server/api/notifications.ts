import express from "express";
import { DaysOfWeek, Knock, RepeatFrequency } from "@knocklabs/node";
import requireUser from "../../utils/requireUser.js";
import { CreateScheduleReqBody } from "../../types/index.js";

const notificationsRouter = express.Router();

const knock = new Knock(process.env.KNOCK_API_KEY);

// POST /api/notifications/schedules
notificationsRouter.post("/schedules", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            const userId = String(req.user.id)
            const { 
                habitName,
                days,
                workflowKey
            }: CreateScheduleReqBody = req.body

           const schedules = await knock.workflows.createSchedules(workflowKey, {
                recipients: [userId],
                repeats: [
                    {
                        frequency: RepeatFrequency.Weekly,
                        days,
                        //TODO: Eventually allow user to set the time of notification?
                        hours: 5,
                        minutes: 0
                    }
                ],
                data: {
                    habit: habitName
                }
            })

            res.send({schedules})
        } catch (e) {
            next(e);
        }
    }
} )

// PUT /api/notifications/schedules
notificationsRouter.put("/schedules", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            const { scheduleIds, days }: {scheduleIds: string[], days: DaysOfWeek[]} = req.body;
            const updatedSchedules = await knock.workflows.updateSchedules({
                schedule_ids: scheduleIds,
                repeats: [
                    {
                        frequency: RepeatFrequency.Weekly,
                        days
                    }
                ]
            })

            res.send({ updatedSchedules });
        } catch (e) {
            next(e);
        }
    }
})


// DELETE /api/notifications/schedules
notificationsRouter.delete("/schedules", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            const { scheduleIds } = req.body;
            const schedules = await knock.workflows.deleteSchedules({
                schedule_ids: scheduleIds
            })

            res.send({
                message: "successfully deleted",
                deletedSchedules: schedules
            })
        } catch (e) {
            next(e)
        }
    }
})

// DELETE /api/notifications/users/:user_id
notificationsRouter.delete("/users/:user_id", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            const id = req.params.user_id
            await knock.users.delete(id)

            res.send({message: "successfully deleted"})
        } catch (e) {
            next(e)
        }
    }
})

// "Identify User" PUT api/notifications/users/:user_id
notificationsRouter.put("/users/:user_id", requireUser, async (req, res, next): Promise<void> => {
    if (req.user) {
        try {
            const id = req.params.user_id
            const { email, username } = req.body;
            
            const user = await knock.users.identify(id, {
                email,
                username
            })
            res.send({user});
        } catch (e) {
            next(e);
        }
    }
})

export default notificationsRouter;