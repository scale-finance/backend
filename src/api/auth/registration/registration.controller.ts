import type { UserType } from "../../../types/models";
import { User, Response } from "../../../models";
import { status } from "../../../types/server";
import { RequestHandler } from "express";

interface RegistrationRes {
    id: string;
}
export const register: RequestHandler = async (req, res) => {
    // get user from request body
    const incomingUser = req.body as unknown as UserType;

    // create response object
    const response = new Response<RegistrationRes>(res);

    // check if user has all required fields
    if (
        !incomingUser?.email ||
        !incomingUser?.password ||
        !incomingUser?.fullName
    ) {
        return response.create(status.badRequest, "Missing required fields.");
    }

    try {
        // create user if applicable
        const user = await User.create(incomingUser);

        // return user id
        return response.create(status.created, "User successfully created.", {
            id: user.id,
        });
    } catch (err) {
        const error = err as Error;

        let statusCode: number;
        switch (true) {
            case error.message.includes("User already exists."):
                statusCode = status.forbidden;
                break;
            default:
                statusCode = status.internalServerError;
        }

        return response.create(statusCode, error.message);
    }
};
