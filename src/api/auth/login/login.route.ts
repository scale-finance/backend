import express from "express";
import { login } from "./login.controller";

// define the login route
const loginRouter = express.Router();
loginRouter.post("/", (req, res, next) => login(req, res, next));

export default loginRouter;
