import {
    Configuration,
    CountryCode,
    Item as PlaidItem,
    ItemGetRequest,
    LinkTokenCreateResponse,
    ItemPublicTokenExchangeResponse,
    PlaidApi,
    PlaidEnvironments,
    Products,
    InstitutionsGetByIdRequest,
    Institution,
} from "plaid";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV;

// check that all required env vars are set
if (!PLAID_CLIENT_ID) throw new Error("PLAID_CLIENT_ID must be set");
if (!PLAID_SECRET) throw new Error("PLAID_SECRET must be set");
if (!PLAID_ENV) throw new Error("PLAID_ENV must be set");

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
            "PLAID-SECRET": PLAID_SECRET,
            "Plaid-Version": "2020-09-14",
        },
    },
});

export default class Plaid {
    private static client = new PlaidApi(configuration);

    /**
     * Creats a link token for a given user
     * 
     * @param userId the user id
     * @returns the link token and other data
     */
    public static async createLinkToken(
        userId: string
    ): Promise<LinkTokenCreateResponse["data"]> {
        // create request for user in session
        const request = {
            user: {
                client_user_id: userId,
            },
            client_name: "Scale Finance",
            products: [
                Products.Auth,
                Products.Transactions,
                Products.Balance,
                Products.CreditDetails,
                Products.RecurringTransactions,
            ],
            country_codes: [CountryCode.Us],
            language: "en",
        };

        // get the token response
        const tokenResponse = await this.client.linkTokenCreate(request);

        // return it
        return tokenResponse.data;
    }

    /**
     * Exchanges a public token for an access token
     */
    public static async exchangePublicToken(
        publicToken: string
    ): Promise<ItemPublicTokenExchangeResponse["data"]> {

        // builds a request for the access token
        const request = {
            public_token: publicToken,
        };

        // calls the exchange api and stores the response data and the access token
        try{
            const exchangeResponse = await this.client.itemPublicTokenExchange(request);
            return exchangeResponse.data;
        } catch (err) {
            throw new Error("Public token change failed");
        }
    }

    /**
     * Gets the item associated with an access token
     * 
     * @param accessToken the plaid access token related to the item
     * @return plaid token
     */
    public static async getItem(accessToken: string): Promise<PlaidItem> {
        const request: ItemGetRequest = {
            access_token: accessToken,
        };

        try {
            // get item
            const response = await this.client.itemGet(request);
            const item = response.data.item;

            return item;
        } catch (err) {
            console.error(err);
            throw new Error("Failed to get item");
        }
    }

    /**
     * Gets the institution associated with an access token
     */
    public static async getInstitution(institutionId: string): Promise<Institution> {
        const request: InstitutionsGetByIdRequest = {
            institution_id: institutionId,
            country_codes: [CountryCode.Us],
        }

        try {
            // get institution
            const response = await this.client.institutionsGetById(request);
            const institution = response.data.institution;

            return institution;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to get institution");
        }
    }
}
