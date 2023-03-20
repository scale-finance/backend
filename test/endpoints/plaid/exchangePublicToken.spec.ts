import app from "../../../src/api/main";
import { User } from "../../../src/models";
import Item from "../../../src/models/Item";
import { status } from "../../../src/types/server";
import MockPlaid from "../../mocks/plaid.mock";
import request from "supertest";
import { instance, mock, spy, when } from "ts-mockito";

const validItemParams = {
    userId: "fake-user-id",
    token: "fake-access-token",
    id: "id",
};

// jwt of fake user-id with test secret
const fakeUserid =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZha2UtdXNlci1pZCJ9.G7S0qW1MxA01_-RYVj-IrJqWX5ZPzyNEUTp4xJdvo14";

beforeEach(() => {
    const spyUser = spy(User);
    when(spyUser.findById("fake-user-id")).thenResolve({
        fullName: "jeff",
        email: "j@example.com",
        id: "fake-user-id",
    });
});

describe("Exchange Public Token", () => {
    describe("Exchange", () => {
        const mockItem = mock(Item);
        const itemInstance = instance(mockItem);
        const spyItem = spy(Item);

        it("will exchange a public token for an access token", async () => {
            // given
            MockPlaid.exchangePublicToken();
            when(
                // TODO (Eddie): I need to change this to a nock request
                spyItem.create(validItemParams.userId, validItemParams.token)
            ).thenResolve(itemInstance);

            // when
            await request(app)
                .post("/api/v0/plaid/exchange-token")
                .set("Cookie", `authToken=${fakeUserid}`)
                .send({
                    publicToken: "fake-public-token",
                })
                .expect(status.ok);
        });

        it("will return bad request if public token is not provided", async () => {
            // given when
            when(
                // TODO (Eddie): I need to change this to a nock request
                spyItem.create(validItemParams.userId, validItemParams.token)
            ).thenResolve(itemInstance);

            const response = await request(app)
                .post("/api/v0/plaid/exchange-token")
                .set("Cookie", `authToken=${fakeUserid}`)
                .send({})
                .expect(status.badRequest);

            // then
            expect(response.body.message).toBe("Public token is required.");
        });

        it("will return 500 if plaid request fails", async () => {
            // then
            MockPlaid.exchangePublicTokenError();

            // when
            const response = await request(app)
                .post("/api/v0/plaid/exchange-token")
                .set("Cookie", `authToken=${fakeUserid}`)
                .send({
                    publicToken: "fake-public-token",
                })
                .expect(status.internalServerError);

            // then
            expect(response.body.message).toBe(
                "Could not exchange public token."
            );
        });
    });
});
