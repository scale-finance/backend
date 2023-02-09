import dotenv from "dotenv";
import app from "./src/api/main";

// gather all .env variables
dotenv.config();

// gather port
const port = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('The application is listening on port ' + port);
});

