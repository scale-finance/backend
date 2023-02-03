import { prismaMock } from "../../prisma/singleton";
import request from "supertest";
import app from "../../src/api/main";

describe("Registration", () => {
    it("can register a user", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.create.mockResolvedValue({
            ...user,
            id: expect.anything(),
            password: expect.anything(),
        });

        await request(app)
            .post("/api/auth/register")
            .send(user)
            .set('Accept', 'application/json')
            .expect(201);
    });

    it("will not register a user that already exists", async () => {
        const user = {
            id: expect.anything(),
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: expect.anything(),
        };

        prismaMock.user.findFirst.mockResolvedValue(user);

        await request(app)
            .post("/api/auth/register")
            .send(user)
            .set('Accept', 'application/json')
            .expect(403);
    });

    it("will not register if required fields are missing", async () => {
        const user = {
            fullName: "John Doe",
        };

        await request(app)
            .post("/api/auth/register")
            .send(user)
            .set('Accept', 'application/json')
            .expect(400);
    });

    it("will throw error if user creation fails", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.create.mockRejectedValue(new Error("Failed to create user in database."));
        prismaMock.user.findFirst.mockResolvedValue(null);

        await request(app)
            .post("/api/auth/register")
            .send(user)
            .set('Accept', 'application/json')
            .expect(500);
    });

    it("will leave create a cookie for the user called authToken", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.create.mockResolvedValue({
            ...user,
            id: expect.anything(),
            password: expect.anything(),
        });

        const response = await request(app)
            .post("/api/auth/register")
            .send(user)
            .set('Accept', 'application/json')
            .expect(201);

        expect(response.header["set-cookie"][0]).toMatch(/authToken/);
    });

    it("will not create a cookie if user creation fails", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.create.mockRejectedValue(new Error("Failed to create user in database."));
        prismaMock.user.findFirst.mockResolvedValue(null);

        const response = await request(app)
            .post("/api/auth/register")
            .send(user)
            .set('Accept', 'application/json')
            .expect(500);

        expect(response.header["set-cookie"]).toBeUndefined();
    });
});
