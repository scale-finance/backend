import { RequestHandler } from "express";
import { Response, User } from "../models";
import jwt from "jsonwebtoken";
import { status } from "../types/server";

/**
 * Middleware in charge of making sure that the api request is authenticated
 * 
 * @param req express request object
 * @param res express response object
 * @param next express next function
 */
const authenticate: RequestHandler = async (req, res, next) => {
    // extract token from session
    const token = req.cookies.authToken;
    const response = new Response(res);

    // if token 
    if (!token) {
        return response.create(status.unauthorized, "Not allowed.");
    }

    // check if id has valid data
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET as string) as Record<string, any>;
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return response.create(status.unauthorized, "Invalid user.");
        }

        // define local storage excluding password details
        res.locals.user = {
            fullName: user.fullName,
            email: user.email,
            id: user.id,
        };

        next();
    } catch (err) {
        return response.create(status.internalServerError, "Failed to authenticate user.");
    }
};

export default authenticate;
