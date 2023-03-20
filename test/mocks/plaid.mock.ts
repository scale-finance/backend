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
            request_id: "fake-request-id",
        });
    }

    public static exchangePublicTokenError(): void {
        nock(this.plaidURI).post("/item/public_token/exchange").reply(500, {
            error_message: "invalid input",
        });
    }

    public static getItem(): void {
        nock(this.plaidURI)
            .post("/item/get")
            .reply(200, {
                item: {
                    available_products: ["auth", "transactions"],
                    billed_products: ["auth", "transactions"],
                    error: null,
                    institution_id: "fake-institution-id",
                    item_id: "fake-item-id",
                    webhook: "",
                },
            });
    }

    public static getItemError(): void {
        nock(this.plaidURI).post("/item/get").reply(500, {
            error_message: "invalid input",
        });
    }

    public static getInstitution(): void {
        nock(this.plaidURI)
            .post("/institutions/get_by_id")
            .reply(200, {
                institution: {
                    country_codes: ["US"],
                    credentials: [
                        {
                            label: "Username",
                            name: "username",
                            type: "text",
                        },
                        {
                            label: "Password",
                            name: "password",
                            type: "password",
                        },
                    ],
                    has_mfa: false,
                    mfa: ["questions"],
                    name: "Fake Institution",
                    products: ["auth", "transactions"],
                    url: "https://fakeinstitution.com",
                },
            });
    }

    public static getInstitutionError(): void {
        nock(this.plaidURI).post("/institutions/get_by_id").reply(500, {
            error_message: "invalid input",
        });
    }
}
