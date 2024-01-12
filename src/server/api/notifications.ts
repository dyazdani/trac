import express from "express";
import { Knock } from "@knocklabs/node";

const notificationsRouter = express.Router();

const knock = new Knock(process.env.KNOCK_API_KEY);

export default notificationsRouter;