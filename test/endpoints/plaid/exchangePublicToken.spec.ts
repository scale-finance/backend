import app from "../../../src/api/main";
import Item from "../../../src/models/Item";
import { status } from "../../../src/types/server";
import MockPlaid from "../../mocks/plaid.mock";
import request from "supertest";
import { instance, mock, spy, when } from "ts-mockito";

const validItemParams = {
    userId: "userId",
    token: "token",
    id: "id",
};

describe("Exchange Public Token", () => {
    describe("Exchange", () => {
        const mockItem = mock(Item);
        const itemInstance = instance(mockItem);
        const spyItem = spy(Item);

        it("will exchange a public token for an access token", async () => {
            // given
            MockPlaid.exchangePublicToken();
            when( // TODO (Eddie): I need to change this to a nock request
                spyItem.create(
                    validItemParams.userId,
                    validItemParams.token,
                    validItemParams.id
                )
            ).thenResolve(itemInstance);

            // when
            await request(app)
                .post("/api/v0/plaid/exchange-public-token")
                .send({
                    publicToken: "fake-public-token",
                })
                .expect(status.ok);
        });

        it("will return bad request if public token is not provided", async () => {
            // given when
            when( // TODO (Eddie): I need to change this to a nock request
                spyItem.create(
                    validItemParams.userId,
                    validItemParams.token,
                    validItemParams.id
                )
            ).thenResolve(itemInstance);

            const response = await request(app)
                .post("/api/v0/plaid/exchange-public-token")
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
                .post("/api/v0/plaid/exchange-public-token")
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
