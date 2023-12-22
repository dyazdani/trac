import express from "express";
import { PrismaClient } from "@prisma/client";
import requireUser from "../../utils/requireUser.js";

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();

const {ACCESS_TOKEN_SECRET} = process.env;

const authRouter = express.Router();


// POST /api/auth/register
authRouter.post("/register", requireUser, async (req, res, next) => {
})


export default authRouter;

