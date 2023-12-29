import {Request, Response, NextFunction} from "express";


const requireUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401);
        next({name: "NotLoggedIn", message: "Must be logged in to access this route."})
    } else {
        next();
    }
}

export default requireUser;