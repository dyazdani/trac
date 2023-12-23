import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { prismaExclude } from "prisma-exclude";
import excludePassword from "../../utils/exclude.js";

const prisma = new PrismaClient();

// const exclude = prismaExclude(prisma);

const { ACCESS_TOKEN_SECRET } = process.env;

const SALT_ROUNDS = 10;

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


// POST /api/login
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
              res.status(500).send({ error: "Internal Server Error" });
            } else if (result) {
              // JSON Web Token returned to client
              // TODO This solves an error, investigate other way to solve
              const token = ACCESS_TOKEN_SECRET ?
              jwt.sign(
                {
                  username: user.username,
                  id: user.id,
                },
                ACCESS_TOKEN_SECRET) : 
                next({name: "InvalidAccessTokenSecret", message: "Access token secret is undefined"});
    
              res.send({
                token,
                user: excludePassword(user),
              });
            } else {
              next({
                name: "IncorrectPassword",
                message: "The password you entered is incorrect",
              });
            }
          }
        );
      } catch (e) {
        next(e);
      }
})


export default authRouter;

