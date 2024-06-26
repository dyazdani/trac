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
    const { email, username, password, adminPasscode } = req.body;

    bcrypt.hash(password, SALT_ROUNDS, async function(err: Error | undefined, hash: string) {
      if (err?.message === 'data and salt arguments required') {
        res.status(401);
        next({
          name: 'MissingPassword', 
          message: 'Must include password when registering'
        })
      }
      
      let isAdmin = adminPasscode === process.env.ADMIN_PASSCODE

      let user;
      try {
        user = await prisma.user.create({
          data: {
            email,
            username,
            password: hash,
            isAdmin
          }
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientValidationError) {
          console.log(e.message)
          res.status(401)
          .send({
            error: e                  
          })
        }
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            console.log(e.message)
          }
          res.status(401)
          .send({
            error: e                  
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

// POST /api/auth/login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
  
    bcrypt.compare(
      password,
      user.password,
      async function (err: Error | undefined, result: boolean) {
        if (err) {
	        console.error("Error in bcrypt.compare:", err);
	        res.status(500);
	        next({name: "InternalServerError"})
        } else if (result) {
          // JSON Web Token returned to client
          const token = ACCESS_TOKEN_SECRET ?
          jwt.sign({
            username: user.username,
            id: user.id,
          },
          ACCESS_TOKEN_SECRET) : 
          res.status(401)
          next({
            name: "InvalidAccessTokenSecret", 
            message: "Access token secret is undefined"
          });

          res.send({
            token,
            user: excludePassword(user),
          });
        } else {
          res
          .send({
            name: "IncorrectPassword",
            message: "The password you entered is incorrect",
          });
        }
      }
    )

  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2001') {
        console.log(e.message)
      }
      res.status(401)
      next({
        name: "RequestError",
        message: "Could not find the provided email"
      })
    }
    next(e);
  }
})

export default authRouter;

