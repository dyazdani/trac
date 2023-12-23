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
    try {
        const { email, username, password } = req.body;
        // TODO: turn this into a helper function
        // If required req.body fields are missing, send 400 response 
        if (!email || !username || !password) {
            const emailMissing = !email ? 'email' : '';
            const usernameMissing = !username ? 'username' : '';
            const passwordMissing = !password ? 'password' : '';
            const missingFields = [emailMissing, usernameMissing, passwordMissing].filter(e => e);
            let missingFieldsString = ''

            for(let i = missingFields.length - 1; i > -1; i--) {
                if (i === missingFields.length - 1) {
                    missingFieldsString = missingFields[i] + missingFieldsString;
                    continue;
                }
                if (i === missingFields.length - 2) {
                    missingFieldsString = missingFields[i] + " and "  + missingFieldsString;
                    continue;
                }

                missingFieldsString = missingFields[i] + ", " + missingFieldsString;
            }

            return res.status(400).send({ name: "Bad Request", message: `The server could not complete the request because required field(s) ${missingFieldsString} missing from request body.` });

        }
        bcrypt.hash(password, SALT_ROUNDS, async function(err: Error | undefined, hash: string) {
            if (err) next(err);
            // Querying DB to see if user with that email already exists
            const userWithEmailInDB = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if (userWithEmailInDB) {
                return res.status(400).send({ name: "Bad Request", message: "The server could not complete the request because a user with this email already exists." });
            }

            // Querying DB to see if user with that username already exists
            const userWithUsernameInDB = await prisma.user.findUnique({
                where: {
                    username: username
                }
            })

            console.dir(userWithUsernameInDB)

            if (userWithUsernameInDB) {
                return res.status(400).send({ name: "Bad Request", message: "The server could not complete the request because a user with this username already exists." });
            }

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

