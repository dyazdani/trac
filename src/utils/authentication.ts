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
            // Jwt should throw error if token cannot be verified,
            // however jwt.verify also returns a string of the token that failed
            // and only returns a JwtPayload object if successful.
            // Therefore, this check for user being a string is a safeguard in case
            // jwt does not throw error.
            if (user && typeof user !== 'string') {
                req.user = user
            }
            console.log(req.user)
            next();
        } catch (e) {
            if (!user) {
                req.user = null;
            }
            console.log(req.user)
            next(e);
        } 
    } else {
        if (!user) {
            req.user = null;
        }
        console.log("request: ", req.user)
        res.status(401)
        .send({name: "MissingAuthorizationHeader", message: "Request authorization header missing or has falsy value"})
    }
}

export default authenticateJWT;