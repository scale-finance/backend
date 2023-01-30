import { user as UserType } from "@prisma/client";
import db from "../../prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { status } from "../types/server";

/**
 * Class handling all user operations
 */
export default class User {
    id: string;
    email: string;
    fullName: string;
    
    private constructor (user: UserType) {
        this.id = user.id;
        this.email = user.email;
        this.fullName = user.fullName;
    }

    static async create (incomingUser: Omit<UserType, "id">): Promise<User> {
        // check if user is unique
        const existingUser = !!(await db.user.findFirst({
            where: { email: incomingUser.email },
        }));
        
        // throw error if user already exists
        if (existingUser) throw new Error("User already exists.");

        // get uuid for user
        const id = uuid();

        // hash the password
        const hashedPassword = await bcrypt.hash(incomingUser.password, 10);

        // create user
        try {
            const user = await db.user.create({
                data: {
                    id,
                    password: hashedPassword,
                    email: incomingUser.email.toLowerCase(), // lowercase email
                    fullName: incomingUser.fullName,
                }
            });
    
            return new User(user);
        } catch (err) {
            console.log(err);
            throw new Error("Failed to create user in database.")
        }
    }
}