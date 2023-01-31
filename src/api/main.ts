import bodyParser from "body-parser";
import express from "express";
import authRouter from "./auth/auth.route";
import cookieParser from "cookie-parser";
import v0Router from "./v0/v0.route";

// gather express
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/v0", v0Router);

export default app;