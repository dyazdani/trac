import express from "express";
import { Knock, RepeatFrequency } from "@knocklabs/node";
import requireUser from "../../utils/requireUser.js";
import { CreateScheduleReqBody } from "../../types/index.js";

const notificationsRouter = express.Router();

const knock = new Knock(process.env.KNOCK_API_KEY);

// POST /api/notifications/schedules
notificationsRouter.post("/schedules", requireUser, async (req, res, next) => {
    if (req.user) {
        try {
            //TODO: change the userId back to being obtained by req.user.id once the mutation is able to be tested on this branch
            // How userId was obtained was changed to req.body because Postman does not have a way to set user property on request
            // const userId = String(req.user.id)
            const { 
                userId,
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