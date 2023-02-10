import { prismaMock } from "../../prisma/singleton";
import { User } from "../../src/models";
import { UserType } from "../../src/types/models";

describe("User Model", () => {
    describe("create()", () => {
        it("can create user", async () => {
            const user: UserType = {
                fullName: "John Doe",
                email: "jdoe@example.com",
                password: "password",
            };

            prismaMock.user.create.mockResolvedValue({
                ...user,
                id: expect.anything(),
                password: expect.anything(),
            });

            await expect(User.create(user)).resolves.toEqual({
                email: user.email,
                fullName: user.fullName,
                id: expect.anything(),
                password: expect.anything(),
            });
        });

        it("will not create user that already exists", async () => {
            const user = {
                id: expect.anything(),
                fullName: "John Doe",
                email: "jdoe@example.com",
                password: "password",
            };

            prismaMock.user.findFirst.mockResolvedValue(user);

            await expect(User.create(user)).rejects.toThrowError(
                "User already exists."
            );
        });

        it("will throw error if user creation fails", async () => {
            const user: UserType = {
                fullName: "John Doe",
                email: "jdoe@example.com",
                password: "password",
            };

            prismaMock.user.create.mockRejectedValue(new Error("Failed to create user in database."));
            prismaMock.user.findFirst.mockResolvedValue(null);

            await expect(User.create(user)).rejects.toThrowError(
                "Failed to create user in database."
            );
        });
    });
    
    describe("findById()", () => {
        it("can find user by id", async () => {
            const user = {
                id: expect.anything(),
                fullName: "John Doe",
                email: "jdoe@example.com",
                password: expect.anything(),
            };

            prismaMock.user.findUnique.mockResolvedValue(user);

            await expect(User.findById(user.id)).resolves.toEqual(user);
        });

        it("will return null if user is not found", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(User.findById("id")).resolves.toEqual(null);
        });

        it("will throw error if user find fails", async () => {
            prismaMock.user.findUnique.mockRejectedValue(new Error("Failed to find user in database."));

            await expect(User.findById("id")).rejects.toThrowError(
                "Failed to find user in database."
            );
        });
    });
    
    describe("hash()", () => {
        it("will hash password", async () => {
            const testPassword = "something";
        
            // @ts-ignore
            await expect(User.hash(testPassword)).resolves.not.toEqual(testPassword);
        });
    });

    describe("findByEmail()", () => {
        it("will find a user by id", () => {
            const user = {
               fullName: "John Doe",
               email: "jdoe@example.com",
               id: expect.anything(),
               password: expect.anything(),
            };

            prismaMock.user.findFirst.mockResolvedValue(user);

            expect(User.findByEmail(user.email)).resolves.toEqual(user);
        });

        it("will return null if no user is found", () => {
            const user = {
                email: "test@email.com",
            };

            prismaMock.user.findFirst.mockResolvedValue(null);

            expect(User.findByEmail(user.email)).resolves.toEqual(null);
        });

        it("will throw if there is an internal server error", () => {
            const user = {
                email: "test@email.com",
            };

            prismaMock.user.findFirst.mockRejectedValue(new Error("something happened"));

            expect(User.findByEmail(user.email)).rejects.toThrowError("Failed to retrieve user from database");
        });
    });
});
