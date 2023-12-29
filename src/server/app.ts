import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import authenticateJWT from "../utils/authentication.js";


const app = express();
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "tiny"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authenticateJWT);

import apiRouter from "./api/index.js";
import e from "express";
app.use("/api", apiRouter);

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

app.use((e: Error, req: Request, res: Response, next: NextFunction):void => {
  if(res.statusCode === 200) {
    res.status(500);
  }
  res.send({ name: e.name, message: e.message})

})




export default app;
