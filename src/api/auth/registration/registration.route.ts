import express from "express";
import { register } from "./registration.controller";
import bodyParser from "body-parser";

// define the registration route
const registrationRouter = express.Router();
registrationRouter.post("/", (req, res, next) => register(req, res, next));

export default registrationRouter;
