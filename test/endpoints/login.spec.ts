import { prismaMock } from "../../prisma/singleton";
import request from "supertest";
import app from "../../src/api/main";
import { status } from "../../src/types/server";

describe("Login", () => {
    it("can login a user", async () => {
        const user = {
            id: "test",
            fullName: "John Doe",
            email: "jdoe@gmail.com",
            password: "password",
        };

        prismaMock.user.findFirst.mockResolvedValue(user);

        await request(app)
            .post("/api/auth/login")
            .send(user)
            .set('Accept', 'application/json')
            .expect(status.ok);
    });

    it("will not login a user that does not exist", async () => {
        const user = {
            id: "test",
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.findFirst.mockResolvedValue(null);

        await request(app)
            .post("/api/auth/login")
            .send(user)
            .set('Accept', 'application/json')
            .expect(status.unauthorized);
    });

    it("will not login if required fields are missing", async () => {
        const user = {
            fullName: "John Doe",
        };

        await request(app)
            .post("/api/auth/login")
            .send(user)
            .set('Accept', 'application/json')
            .expect(status.badRequest);
    });

    it("will throw error if user creation fails", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.findFirst.mockRejectedValue(new Error("Test error"));

        await request(app)
            .post("/api/auth/login")
            .send(user)
            .set('Accept', 'application/json')
            .expect(status.internalServerError);
    });

    it("will create a cookie on successful login", async () => {
        const user = {
            id: "test",
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.findFirst.mockResolvedValue(user);

        const response = await request(app)
            .post("/api/auth/login")
            .send(user)
            .set('Accept', 'application/json')
            .expect(status.created)
            
        expect(response.header["set-cookie"][0]).toMatch(/authToken/);
    });

    it("will not create a cookie if user creation fails", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "password",
        };

        prismaMock.user.findFirst.mockRejectedValue(new Error("Test error"));

        const response = await request(app)
            .post("/api/auth/login")
            .send(user)
            .set('Accept', 'application/json')
            .expect(status.internalServerError)

        expect(response.header["set-cookie"]).toBeUndefined();
    });
});