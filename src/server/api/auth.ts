import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import excludePassword from "../../utils/excludePassword.js";

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();


const {ACCESS_TOKEN_SECRET} = process.env;

const authRouter = express.Router();


// POST /api/auth/register
authRouter.post("/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        bcrypt.hash(password, SALT_ROUNDS, async function(err: Error | undefined, hash: string) {
            if (err?.message === 'data and salt arguments required') {
                res.status(401);
                next({
                    name: 'MissingPassword', 
                    message: 'Must include password when registering'
                })
            }
           
            let user;
            try {
                user = await prisma.user.create({
                    data: {
                        email,
                        username,
                        password: hash
                    }
                })
            } catch (e) {
                if (e instanceof Prisma.PrismaClientValidationError) {
                    console.log(e.message)
                    res.status(401)
                    next({
                        name: "ValidationError", 
                        message: e.message                    
                    })
                }
                  if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    // The .code property can be accessed in a type-safe manner
                    if (e.code === 'P2002') {
                      console.log(e.message)
                    }
                    res.status(401)
                    next({
                        name: "RequestError", 
                        message: e.message                    
                    })
                }
                
            }

            if (user) {
                // JSON Web Token returned to client
                const token = ACCESS_TOKEN_SECRET ? 
                jwt.sign({
                    username: user?.username,
                    id: user?.id,
                }, ACCESS_TOKEN_SECRET) : 
                res.status(401)
                next({
                    name: "InvalidAccessTokenSecret", 
                    message: "Access token secret is undefined"
                });
            
                res.send({
                    token,
                    user: excludePassword(user)
                });
            }
        })
    } catch (e) {
        next(e)
    }
})


export default authRouter;

