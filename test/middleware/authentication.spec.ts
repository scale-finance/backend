import { prismaMock } from "../../prisma/singleton";
import authenticate from "../../src/middleware/authentication";
import { status } from "../../src/types/server";

const fakeJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNvbWUgaWQifQ.AYrfUCXHiCNFtsaFz0mhc4nxVzZy_BJmdUa-pb36BEA";

describe("Authentication Middleware", () => {
    it("should be unauthorized if no token is provided", () => {
        const req = {
            cookies: {
                authToken: null,
            },
        };
        const res = {
            cookie: jest.fn(),
            json: jest.fn(),
        };
        const next = jest.fn();

        authenticate(req as any, res as any, next);

        expect(res.json).toHaveBeenCalledWith({
            status: status.unauthorized,
            message: "Not allowed.",
        });
    });

    it("should be unauthorized if failed to authenticate", () => {
        const req = {
            cookies: {
                authToken: "token",
            },
        };
        const res = {
            cookie: jest.fn(),
            json: jest.fn(),
        };
        const next = jest.fn();

        prismaMock.user.findUnique.mockRejectedValue(
            new Error("Failed to authenticate user.")
        );
        authenticate(req as any, res as any, next);

        expect(res.json).toHaveBeenCalledWith({
            status: status.internalServerError,
            message: "Failed to authenticate user.",
        });
    });

    it("should be unauthorized if user is not found", async () => {
        const req = {
            cookies: {
                authToken: fakeJWT,
            },
        };
        const res = {
            cookie: jest.fn(),
            json: jest.fn(),
        };
        const next = jest.fn();

        prismaMock.user.findUnique.mockResolvedValue(null);
        await authenticate(req as any, res as any, next);

        expect(res.json).toHaveBeenCalledWith({
            status: status.unauthorized,
            message: "Invalid user.",
        });
    });

    it("should be authorized if user is found", async () => {
        const req = {
            cookies: {
                authToken: fakeJWT,
            },
        };
        const res = {
            cookie: jest.fn(),
            json: jest.fn(),
            locals: {
                user: null,
            },
        };
        const next = jest.fn();

        prismaMock.user.findUnique.mockResolvedValue({
            id: "some id",
            email: "some email",
            password: "string",
            fullName: "string",
        });
        await authenticate(req as any, res as any, next);

        // expect local to be passed on
        expect(res.locals.user).toEqual({
            id: "some id",
            email: "some email",
            fullName: "string",
        });
        expect(next).toHaveBeenCalled();
    });
});
