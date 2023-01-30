import bodyParser from "body-parser";
import express from "express";
import authRouter from "./auth/auth.route";

// gather express
const app = express();

app.use(bodyParser.json());
app.use("/auth", authRouter);

export default app;