import express from "express";
import registrationRouter from "./registration/registration.route";
import loginRouter from "./login/login.route";

const authRouter = express.Router();

authRouter.post("/", (req, res) => {
    res.send("Hello Auth!");
});

authRouter.use("/register", registrationRouter);
authRouter.use("/login", loginRouter);
authRouter.use("/logout", (req, res) => res.clearCookie("authToken").send("Logged out"));

export default authRouter;