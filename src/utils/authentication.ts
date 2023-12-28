import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: number;
        email: string;
        dateCreated: Date;
        username: string;
        password: string;
        isAdmin: boolean;
    }
}


const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let user;

    if (authHeader && authHeader.startsWith("Bearer ") && process.env.ACCESS_TOKEN_SECRET) {
        const token = authHeader.split(' ')[1];
        try {
            user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if (user && typeof user !== 'string') {
                req.user = user
            } else {
                req.user = null
            }
            next();
        } catch (e) {
            next(e);
        } 
    } else {
        next();
    }
}

export default authenticateJWT;