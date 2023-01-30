import express from "express";
import dotenv from "dotenv";

// gather all .env variables
dotenv.config();

// gather express
const app = express();

// gather port
const port = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log('The application is listening on port ' + port);
})