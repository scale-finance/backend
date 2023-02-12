import { prismaMock } from "../../prisma/singleton";
import request from "supertest";
import app from "../../src/api/main";
import { status } from "../../src/types/server";

const validHash = "$2b$10$sz0hlF0y4RLc2QILnTbEGuy0SJsCNjP0v65TiaOFyEq4kqTJEwjwy";

describe("Login", () => {
    it("can login a user", async () => {
        const user = {
            id: "test",
            fullName: "John Doe",
            email: "jdoe@gmail.com",
            password: validHash,
        };

        prismaMock.user.findFirst.mockResolvedValue(user);

        await request(app)
            .post("/api/auth/login")
            .send({ password: "password", email: user.email })
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

    it("will not login if the password does not match incoming password", async () => {
        const user = {
            fullName: "John Doe",
            email: "jdoe@example.com",
            password: "not the right password",
        };

        prismaMock.user.findFirst.mockResolvedValue({
           id: expect.anything(),
           email: user.email,
           fullName: user.fullName,
           password: "password hash from db",
        });

        await request(app)
            .post("/api/auth/login")
            .send(user)
            .set("Accept", "application/json")
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

    it("will throw error if user login fails", async () => {
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
            password: validHash,
        };

        prismaMock.user.findFirst.mockResolvedValue(user);

        const response = await request(app)
            .post("/api/auth/login")
            .send({ password: "password", email: user.email })
            .set('Accept', 'application/json')
            .expect(status.ok)
            
        expect(response.header["set-cookie"][0]).toMatch(/authToken/);
    });

    it("will not create a cookie if user login fails", async () => {
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
