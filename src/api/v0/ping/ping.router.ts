import express from "express";

const pingRouter = express.Router();

pingRouter.get("/", (req, res) => {
    res.json({ message: "PONG: authorized" });
});

export default pingRouter;
