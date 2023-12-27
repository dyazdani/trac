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

    if (authHeader && authHeader.startsWith("Bearer ") && process.env.ACCESS_TOKEN_SECRET) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            // Jwt should throw error if token cannot be verified,
            // however jwt.verify also returns a string of the token that failed
            // and only returns a JwtPayload object if successful.
            // Therefore, this check for user being a string is a safeguard in case
            // jwt does not throw error.
            if (typeof user !== 'string') {
                req.user = user
            } else {
                req.user = null;
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