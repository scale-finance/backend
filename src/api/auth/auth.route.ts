import express from "express";
import registrationRouter from "./registration/registration.route";

const authRouter = express.Router();

authRouter.post("/", (req, res) => {
    res.send("Hello Auth!");
});

authRouter.use("/register", registrationRouter);

export default authRouter;