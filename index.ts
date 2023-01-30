import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/api/auth/auth.route";
import bodyParser from "body-parser";
import app from "./src/api/main";

// gather all .env variables
dotenv.config();

// gather port
const port = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log('The application is listening on port ' + port);
})