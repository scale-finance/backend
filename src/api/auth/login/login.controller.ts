import type { UserType } from "../../../types/models";
import { User, Response } from "../../../models";
import { status } from "../../../types/server";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";

interface LoginRes {
    id: string;
}

export const login: RequestHandler = async(req, res) => {
    //get the user from request body
    const incomingUser = req.body as unknown as UserType;

    //create response object
    const response = new Response<LoginRes>(res);

    // check if user has all required fields
    if (
        !incomingUser?.email ||
        !incomingUser?.password ||
        !incomingUser?.fullName
    ) {
        return response.create(status.badRequest, "Missing required fields");
    }

    const user = await User.findByEmail(incomingUser.email);
    if (user == null)
    {
        return response.create(status.unauthorized, "Account with this email does not exist");
    }
    /*
    if (!await bcrypt.compare(incomingUser.password, 'test'))
    {
        return response.create(status.unauthorized, "Incorrect Password");
    }
    */



    try {
        // authenticate the user
        // !!!>>> response.authenticate(incomingUser);

        // return success response
        return response.create(status.ok, "User login success");
    } catch (err) {
        const error = err as Error;
        let statusCode : number;
        switch(true){
            default:
                statusCode = status.internalServerError;
        }
        return response.create(statusCode, error.message);
    }

}
