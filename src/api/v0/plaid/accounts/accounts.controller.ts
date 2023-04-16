import type { Handler } from "express";
import { Response } from "../../../../models";
import Plaid from "../../../../models/Plaid";
import Item from "../../../../models/Item";
import { status } from "../../../../types/server";

interface AccountRes {
    accountsData: any[];
}

export const getAllAccountsData: Handler = async (req, res) => {
    //create response object
    const response = new Response<AccountRes>(res);

    // get userid from request body
    const user = response.getUser();

    // create a user's item list
    const itemList = await Item.get(user.id);

    // declare promise array
    const promiseArr = [];

    // fill that promise array with each item's transactions
    const data: any = {};
    for (let i = 0; i < itemList.length; i++) {
        promiseArr.push(async () => {
            const institution = itemList[i].institutionId;
            data[institution] = {};
            const response = await Plaid.getTransactions(itemList[i].token);
            response.data.transactions.forEach((transaction: any) => {
                // if the account doesn't exist, create it
                if (!data?.[institution]?.[transaction.accountId])
                    data[institution][transaction.accountId] = [];
                
                // push the transaction to the account
                data[institution][transaction.accountId].push(transaction);
            })
        });
    }

    try {
        // promises work in parallel, and return a status (fulfilled/rejected) with a value or reason
        const results = await Promise.allSettled(promiseArr);

        // filter the results for just the fulfilled Promises
        const fulfillments = results?.filter(
            (settled) => settled.status === "fulfilled"
        );

        // if no accounts were found, return a 40
        if (!fulfillments?.length) {
            return response.create(status.notFound, "No transactions found.");
        }

        // return the list of all accounts for all items
        return response.create(status.ok, "Accounts merge successful", {
            accountsData: data as any[],
        });
    } catch (err) {
        console.error((err as Error).message);
        response.create(500, "Promises fullfilment failure.");
    }
};
