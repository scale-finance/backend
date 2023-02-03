import { Response as Res } from "express";
import jwt from "jsonwebtoken";
import User from "./User";

/**
 * This interface should be used to describe all responses from the server. If
 * a return type is applicable it can be added to the data property.
 * 
 * @param T the type of the data property
 */
export default class Response<T = void> {
    private res: Res;

    /**
     * Overrides express object to allow for custom response types
     * 
     * @param res the express response object
     */
    constructor(res: Res) {
        this.res = res;
    }

    create(status: number, message: string, data?: T) {
        this.res.statusCode = status
        this.res.json({
            status,
            message,
            data,
        });
    }

    /**
     * Authenticates a user and sets a cookie with a JWT
     * @param user the user to authenticate
     */
    async authenticate(user: User) {
        // generate jwt token
        const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET as string, {
            expiresIn: "7d",
        });

        // expire cookie in 1 week
        const expiration = 1000 * 60 * 60 * 24 * 7;

        this.res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: expiration,
        });
    }

    /**
     * Gets the user from the response
     * 
     * @returns the user from the response
     */
    getUser(): User {
        return new User(this.res.locals.user);
    }
}
