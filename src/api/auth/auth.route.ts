import express from "express";
import loginRouter from "./login/login.route";
import registrationRouter from "./registration/registration.route";

const authRouter = express.Router();

authRouter.post("/", (req, res) => {
    res.send("Hello Auth!");
});

authRouter.use("/register", registrationRouter);
authRouter.use("/login", loginRouter);

export default authRouter;