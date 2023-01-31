import { Response } from "../../src/models";
import { status } from "../../src/types/server";

describe("Response Model", () => {
    it("can create response", async () => {
        const res = {
            statusCode: 0,
            json: jest.fn(),
        };

        const response = new Response(res as any);
        response.create(status.ok, "Success");

        expect(res.json).toHaveBeenCalledWith({
            status: status.ok,
            message: "Success",
            data: undefined,
        });
    });

    it("can create response with data", async () => {
        const res = {
            statusCode: 0,
            json: jest.fn(),
        };

        const response = new Response<{ test: string }>(res as any);
        response.create(status.ok, "Success", { test: "test" });

        expect(res.json).toHaveBeenCalledWith({
            status: status.ok,
            message: "Success",
            data: { test: "test" },
        });
    });

    it("can authenticate user", async () => {
        const res = {
            statusCode: 0,
            json: jest.fn(),
            cookie: jest.fn(),
        };

        const response = new Response(res as any);
        await response.authenticate({ id: 1 } as any);

        expect(res.cookie).toHaveBeenLastCalledWith("authToken", expect.anything(), {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 604800000,
        });
    });

    it("can get user", async () => {
        const res = {
            statusCode: 0,
            json: jest.fn(),
            cookie: jest.fn(),
            locals: {
                user: { id: 1 },
            },
        };

        const response = new Response(res as any);
        const user = response.getUser();

        expect(user.id).toBe(1);
    });
});
