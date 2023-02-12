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
        !incomingUser?.password
    ) {
        return response.create(status.badRequest, "Missing required fields");
    }

    // create variable to check for user in database
    let foundUser: User | null;
    try 
    {
        foundUser = await User.findByEmail(incomingUser.email);
        if(foundUser == null)
        {
            return response.create(status.unauthorized, "Account does not exist");
        }
        try
        {
            // compare typed in password to password attached to email in database
            if(foundUser?.password)
            {
                if(!await bcrypt.compare(incomingUser.password, foundUser.password))
                {
                    return response.create(status.unauthorized, "Incorrect Password");
                }
            }
            else{
                throw new Error("Password doesn't exist, this shouldn't happen");
            }
        }
        catch(err)
        {
            return response.create(status.internalServerError, "Password comparison failed");
        }
    } 
    catch (err) 
    {
        return response.create(status.internalServerError, "Account retrieval failed");
    }

    try {
        // authenticate the user
        response.authenticate(foundUser!);

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