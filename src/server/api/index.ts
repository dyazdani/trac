import express from "express";

const apiRouter = express.Router();

// GET /api
apiRouter.get("/", (req, res, next): void => {
    try {
        res.send("API is live");
    } catch(e) {
        next(e)
    }
});

import authRouter from './auth.js';
apiRouter.use("/auth", authRouter);

import usersRouter from './users.js';
apiRouter.use("/users", usersRouter);

apiRouter.use((req, res): void => {
  res.status(404).send({ message: "Invalid API endpoint" });
});

export default apiRouter;