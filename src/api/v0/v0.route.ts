import express from "express";
import authenticate from "../../middleware/authentication";
import pingRouter from "./ping/ping.router";
import plaidRouter from "./plaid/plaid.route";

const v0Router = express.Router();

v0Router.use(authenticate);
v0Router.use("/plaid", plaidRouter);
v0Router.use("/ping", pingRouter);

export default v0Router;
