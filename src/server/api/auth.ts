import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import excludePassword from "../../utils/excludePassword.js";

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();


const {ACCESS_TOKEN_SECRET} = process.env;

const authRouter = express.Router();


// POST /api/auth/register
authRouter.post("/register", async (req, res, next) => {
    //TODO: Is this where an error or server response code should occur when email or username is not unique?
    try {
        const { email, username, password } = req.body;
        bcrypt.hash(password, SALT_ROUNDS, async function(err: Error | undefined, hash: string) {
            if (err) next(err);
            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hash
                }
        })
        // JSON Web Token returned to client
        const token = ACCESS_TOKEN_SECRET ? 
            jwt.sign({
                username: user.username,
                id: user.id,
            }, ACCESS_TOKEN_SECRET) :
            next({name: "InvalidAccessTokenSecret", message: "Access token secret is undefined"})
        
        res.send({
            token,
            user: excludePassword(user)
        });
    })
    } catch (e) {
        next(e)
    }

})


export default authRouter;

