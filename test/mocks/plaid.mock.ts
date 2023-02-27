import nock from "nock";

export default class MockPlaid {
    private static plaidURI = "https://sandbox.plaid.com";

    public static createLinkToken(): void {
        nock(this.plaidURI).post("/link/token/create").reply(200, {
            expiration: "2023-02-21T08:34:18Z",
            link_token: "fake-link-token",
            request_id: "fake-request-id",
        });
    }

    public static createLinkTokenError(): void {
        nock(this.plaidURI).post("/link/token/create").reply(500, {
            error_message: "invalid input",
            request_id: "fake-request-id",
        });
    }

    public static exchangePublicToken(): void {
        nock(this.plaidURI).post("/item/public_token/exchange").reply(200, {
            access_token: "fake-access-token",
            item_id: "fake-item-id",
            request_id: "fake-request-ida",
        });
    }

    public static exchangePublicTokenError(): void {
        nock(this.plaidURI)
            .post("/item/public_token/exchange")
            .reply(500, {
                error_message: "invalid input",
            });
    }
}
