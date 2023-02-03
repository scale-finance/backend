import { user as UserType } from "@prisma/client";
import db from "../../prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

/**
 * Class handling all user operations
 */
export default class User {
    id: string;
    email: string;
    fullName: string;
    password?: string;
    
    constructor (user: UserType) {
        this.id = user.id;
        this.email = user.email;
        this.fullName = user.fullName;
        this.password = user.password;
    }

    /**
     * Creates a new user
     * 
     * @param incomingUser incoming user to be created
     * @returns the newly created user
     */
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
        const hashedPassword = await this.hash(incomingUser.password);

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

    /**
     * Finds the user by the email
     *
     * @param email inputted email to find
     * @returns user that matches email, or null otherwise
     */
     static async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await db.user.findFirst({ where: { email } });

            if (!user) return null;
            return new User(user);
        } catch (err) {
            console.error(err);
            throw new Error("Failed to retrieve user from database");
        }
    }

    /**
     * Given a password string, this function will hash the password
     * 
     * @param password password given via user input
     * @returns hashed password
     */
    private static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    /**
     * Find the user with the given id
     * 
     * @param id the id of the user to find
     * @returns user if found, null if not found
     */
    static async findById(id: string): Promise<User | null> {
        try {
            const user = await db.user.findUnique({ where: { id } });
        
            if (!user) return null;
            return new User(user);
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find user in database.");
        }
    }
}
