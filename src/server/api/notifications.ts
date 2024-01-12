import express from "express";
import { Knock, RepeatFrequency } from "@knocklabs/node";
import requireUser from "../../utils/requireUser.js";
import { CreateCheckInScheduleReqBody } from "../../types/index.js";

const notificationsRouter = express.Router();

const knock = new Knock(process.env.KNOCK_API_KEY);

// POST /api/notifications/schedules
notificationsRouter.post("/schedules", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            const userId = String(req.user.id)
            const { 
                habitName,
                checkInDay,
                workflowKey
            }: CreateCheckInScheduleReqBody = req.body

           const schedules = await knock.workflows.createSchedules(workflowKey, {
                recipients: [userId],
                repeats: [
                    {
                    frequency: RepeatFrequency.Weekly,
                    days: [checkInDay],
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

export default notificationsRouter;