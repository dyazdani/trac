import express from "express";
import { PrismaClient } from "@prisma/client";

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();

const {ACCESS_TOKEN_SECRET} = process.env;

const usersRouter = express.Router();


// POST /api/auth/register
usersRouter.post("/register", async (req, res, next) => {
})


export default usersRouter;

