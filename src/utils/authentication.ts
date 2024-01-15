import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import prisma from './test/prisma.js';

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


const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let user;

    if (authHeader && authHeader.startsWith("Bearer ") && process.env.ACCESS_TOKEN_SECRET) {
        const token = authHeader.split(' ')[1];
        try {
            user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if (user && typeof user !== 'string') {

                const userFromDatabase = await prisma.user.findUnique({
                    where: {
                        id: user.id
                    }
                })

                if (userFromDatabase) {
                    req.user = {...user, isAdmin: userFromDatabase.isAdmin}
                }
            } else {
                req.user = null
            }
            next();
        } catch (e) {
            if (e instanceof Error) {
                if (
                    e.name === 'JsonWebTokenError' ||
                    e.name === 'TokenExpiredError' ||
                    e.name === 'NotBeforeError'
                ) {
                    res.status(401);
                } 
            }
            next(e);
        } 
    } else {
        next();
    }
}

export default authenticateJWT;
