import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'tiny'));

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

export default app;