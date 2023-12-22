import express from "express";
import { PrismaClient } from "@prisma/client";
import { prismaExclude } from "prisma-exclude";
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();
const exclude = prismaExclude(prisma);


const {ACCESS_TOKEN_SECRET} = process.env;

const authRouter = express.Router();


// POST /api/auth/register
authRouter.post("/register", async (req, res, next) => {
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
        const token = jwt.sign({
            username: user.username,
            id: user.id,
        }, ACCESS_TOKEN_SECRET);
        
        res.send({
            token,
            user: exclude("user", ["password"])
        });
    })
    } catch (e) {
        next(e)
    }

})


export default authRouter;

