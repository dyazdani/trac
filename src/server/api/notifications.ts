import express from "express";
import { Knock } from "@knocklabs/node";
import requireUser from "../../utils/requireUser.js";

const notificationsRouter = express.Router();

const knock = new Knock(process.env.KNOCK_API_KEY);

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