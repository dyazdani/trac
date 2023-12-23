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

import authRouter from "./auth.js";
apiRouter.use("/auth", authRouter);

export default apiRouter;