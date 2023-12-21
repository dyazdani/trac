import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";

const prisma = new PrismaClient();


const app = express();
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "tiny"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));



import apiRouter from "./api/index.js";
app.use("/api", apiRouter);

app.get("*", (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  } catch (error) {
    next(error);
  }
});

app.get("/health", async (_, res, next) => {
  try {
    res.send({ status: "UP" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ status: "DOWN", error: error.message });
    } else {
      res
        .status(500)
        .send({ status: "DOWN", error: "An unknown error occurred" });
    }
  }
});

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

app.use((req, res): void => {
  res.status(404)
    .send({ message: "Invalid Route"})
})

app.use((error: Error, req: Request, res: Response, next: NextFunction):void => {
  res.status(500)
    .send({ name: error.name, message: error.message })
})


export default app;
