import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
import { prismaExclude } from "prisma-exclude";
import excludePassword from "../../utils/exclude.js";

const prisma = new PrismaClient();

const exclude = prismaExclude(prisma);

const { ACCESS_TOKEN_SECRET } = process.env;

const usersRouter = express.Router();


// POST /api/login
usersRouter.post("/login", async (req, res, next) => {
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
              const token = jwt.sign(
                {
                  username: user.username,
                  id: user.id,
                },
                ACCESS_TOKEN_SECRET
              );
    
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


export default usersRouter;

