import db from "../../prisma/client";
import Plaid from "./Plaid";

export default class Item {
    public token: string;
    public institutionId: string;

    constructor(token: string, institutionId: string) {
        this.token = token;
        this.institutionId = institutionId;
    }

    /**
     * This function will create an item for a given user. It will call plaid
     * API to get institution information and will save it to the database.
     *
     * @param userId user id
     * @param token access token related to item
     */
    public static async create(
        userId: string,
        accessToken: string
    ): Promise<Item> {
        // get the plaid item
        const item = await Plaid.getItem(accessToken);

        // check that the institution exists
        let institutionExists = false;
        try {
            // check whether the institution exists in the database
            institutionExists = Boolean(
                await db.institution.findUnique({
                    where: {
                        institutionId: item.institution_id as string,
                    },
                })
            );
        } catch (err) {
            console.error(err);

            throw new Error("Failed to get institution data");
        }

        // if it doesn't exist, get the institution information from plaid
        
        try {
            if (!institutionExists) {
                // get the institution information from plaid
                const instutition = await Plaid.getInstitution(
                    item.institution_id as string
                );

                // if it doesn't exist, get the institution information from plaid
                await db.institution.create({
                    data: {
                        institutionId: item.institution_id as string,
                        name: instutition.name,
                        logo: instutition.logo,
                        primaryColor: instutition.primary_color
                    },
                });
            }
        } catch (err) {
            console.error(err);
            throw new Error("Failed to create institution data");
        }

        // create the item in the database
        try {
            await db.plaidToken.create({
                data: {
                    userId: userId,
                    accessToken: accessToken,
                    institutionId: item.institution_id as string,
                },
            });

            return new Item(
                accessToken,
                item.item_id,
            );
        } catch (err) {
            console.error(err);
            throw new Error("Failed to create item");
        }
    }

    /**
     * This function will get all items for a given user.
     *
     * @param userId user id
     * @return array of items
     */
    public static async get(userId: string): Promise<Item[]> {
        // get the plaid items
        try {
            const items = await db.plaidToken.findMany({
                where: {
                    userId: userId,
                },
            });

            return items.map(
                (item) => new Item(item.accessToken, item.institutionId)
            );
        } catch (err) {
            console.error(err);
            throw new Error("Failed to get items");
        }
    }

    /**
     * This function will get all institution data for a given item.\
     * 
     * @return institution data
     */
    public async getInstitutionData(): Promise<any> {
        try {
            const institution = await db.institution.findUnique({
                where: {
                    institutionId: this.institutionId,
                },
            });

            return institution;
        } catch (err) {
            console.error(err);
            throw new Error("Failed to get institution data");
        }
    }
}
