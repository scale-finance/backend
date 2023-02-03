import express from "express";
import authenticate from "../../middleware/authentication";
import pingRouter from "./ping/ping.router";

const v0Router = express.Router();

v0Router.use(authenticate);
v0Router.use("/ping", pingRouter);

export default v0Router;
