import { prismaMock } from "../../prisma/singleton";
import { User } from "../../src/models";
import { UserType } from "../../src/types/models";

describe("User Model", () => {
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

    it("can find user by id", async () => {
        const user = {
            id: expect.anything(),
            fullName: "John Doe",
            email: "jdoe@example.com",
        };

        prismaMock.user.findUnique.mockResolvedValue({
            ...user,
            password: expect.anything(),
        });

        await expect(User.findById(user.id)).resolves.toEqual(user);
    });

    it("will return null if user is not found", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(User.findById("id")).resolves.toEqual(null);
    });

    it("will hash password", async () => {
        const testPassword = "something";
        
        // @ts-ignore
        await expect(User.hash(testPassword)).resolves.not.toEqual(testPassword);
    });

    it("will throw error if user find fails", async () => {
        prismaMock.user.findUnique.mockRejectedValue(new Error("Failed to find user in database."));

        await expect(User.findById("id")).rejects.toThrowError(
            "Failed to find user in database."
        );
    });
});
