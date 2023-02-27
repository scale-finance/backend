import { prismaMock } from "../../../prisma/singleton";
import app from "../../../src/api/main";
import { fakeJWT } from "../../utils";
import request from "supertest";
import MockPlaid from "../../mocks/plaid.mock";

beforeEach(() => {
    // mocks successful user retrieval
    prismaMock.user.findUnique.mockResolvedValue({
        id: "some id",
        email: "some email",
        password: "string",
        fullName: "string",
    });
});

describe("Link Token", () => {
    describe("Create", () => {
        it("can create a link token", async () => {
            MockPlaid.createLinkToken();

            const response = await request(app)
                .get("/api/v0/plaid/link-token/create")
                .set("Cookie", [`authToken=${fakeJWT}`])
                .expect(200);

            expect(response.body.data).toHaveProperty("link_token");
        });

        it("returns 500 if plaid request fails", async () => {
            MockPlaid.createLinkTokenError();

            const response = await request(app)
                .get("/api/v0/plaid/link-token/create")
                .set("Cookie", [`authToken=${fakeJWT}`])
                .expect(500);

            expect(response.body.message).toBe("Could not create link token");
        });
    });
});
