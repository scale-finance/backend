export default class Item {
    private token: string;
    public id: string;
    public institutionId: string;

    constructor(token: string, id: string, institutionId: string) {
        this.token = token;
        this.id = id;
        this.institutionId = institutionId;
    }

    /**
     * This function will create an item for a given user. It will call plaid
     * API to get institution information and will save it to the database.
     * 
     * @param userId user id
     * @param token access token related to item
     * @param id item id
     */
    public static async create(
        userId: string,
        accessToken: string,
        id: string,
    // @ts-expect-error
    ): Promise<Item> {}
}
