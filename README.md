# Welcome to Scale Backend

This is the main repository for the Scale Backend! Everything related to our API will be found in this repo!

## Setup

### Clone repo

This is pretty self-explanetory, just type in the following commands in the terminal:

```zsh
git clone "https://github.com/scale-finance/backend.git"
cd backend
```

### Creating a `.env` file

To get started, you first need to create a new file called `.env`, the contents of this environment file, you can get from a repo admin.

### Installing Dependencies

After having the `.env` defined, you are going to want to install all dependencies using:

```zsh
npm i
```

### Scripts

The major scripts or terminal commands can be listed below:

```zsh
npm start # starts the app in the current terminal
npm test  # will test all available test files
```

## Endpoints Information

### Response Schema

When you send any form of request, the endpoints will return a status code attached to a message describing the reasoning. Listed below are some of the codes you can expect to see and what they mean.

200 - OK! Whatever call that was made is a success, nothing to worry about.

201 - Created. Usually returned on a successful user registration.

400 - Bad request. Most likely some missing information in your api call.

401 - Unauthorized. This typically is returned when a login fails.

403 - The user you're trying to create already exists.

500 - Internal server error, something went wrong on the backend. Don't worry about it, just let the backend team know.

### Registration

This endpoint handles account creation. To register a new user in the database, make a POST request. Click "Body", click the "Text" dropdown and set it to JSON. The schema for this call is an email, password, and a full name. Fill out the information according to the format shown in the screenshot. To avoid cluttering the database, I show an already registered user in the example, but if the email is changed a successful 201 code should be returned.

![Register](https://github.com/scale-finance/backend/blob/add-readme-instructions/images/registration%20example.png?raw=true)

### Login

The login endpoint is what will actually authenticate the current user and create a cookie to store their current session. To test this on postman (desktop version), create a post request to the path "localhost:8080/api/auth/login. Fill out the details of a registered user in the format shown in the screenshot, send the request, and a successful login message should appear.

![Login](https://github.com/scale-finance/backend/blob/add-readme-instructions/images/login%20success.png?raw=true)

### Ping

An endpoint to check whether the current user is logged in or not. To make this work, first make a POST request to the Login endpoint with an existing user's info. Then, make a GET request to this endpoint and it will return whether or not the current user is authorized.

![Ping](https://github.com/scale-finance/backend/blob/add-readme-instructions/images/ping%20authorized.png?raw=true)