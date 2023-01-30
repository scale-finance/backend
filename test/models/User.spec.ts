import { prismaMock } from "../../prisma/singleton";
import { User } from "../../src/models";
import { UserType } from "../../src/types/models";

describe("User", () => {
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
});
