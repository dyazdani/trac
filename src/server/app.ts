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

app.use((error: Error, req: Request, res: Response, next: NextFunction):void => {
  if (error.name === "NotLoggedIn") {
    res.status(401)
    .send({ 
      name: error.name, 
      message: error.message
    })
  }
  // Send 401 or 400 error if the error is a certain jwt error
  
  //TODO: Would prefer to instanceof checks instead of string
  // comparison of e.name property however that keeps throwing a SyntaxError
  // stemming from the augmentation of 'jsonwebtoken' module in authentication.ts.
  // TODO: Is checking error name like this in this part of the app best practice?
  if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError' ||
    error.name === 'NotBeforeError'
  ) {
    if (error.message === "invalid signature") {
      res.status(401)
      .send({name: error.name, message: error.message})
    } else {
      res.status(400)
      .send({name: error.name, message: error.message})
    }
  } else {
    // send 500 status code for all other errors caught
      res.status(500)
    .send({ 
      name: error.name, 
      message: error.message 
    })
  }
})




export default app;
