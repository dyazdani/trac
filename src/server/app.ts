import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "tiny"));

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

export default app;
