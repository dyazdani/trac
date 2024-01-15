import {Request, Response, NextFunction} from "express";


const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && !req.user.isAdmin) {
        res.status(403);
        next({name: "NotAdmin", message: "Must be an administrator to access this route."})
    } else {
        next();
    }
}

export default requireAdmin;