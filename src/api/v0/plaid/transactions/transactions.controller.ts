import type { Handler } from "express";
import { Response } from "../../../../models";
import Plaid from "../../../../models/Plaid";
import Item from "../../../../models/Item";
import { status } from "../../../../types/server";


interface TransactionRes {
    id: string;
}

export const getAllTransactions: Handler = async (req, res) => {
    if (req.query.accessToken) {
        const transactions = await Plaid.getTransactions(req.query.accessToken as string);

        return res.status(status.ok).json(transactions);
    }

    //create response object
    const response = new Response<TransactionRes>(res);

    // get userid from request body
    const user = response.getUser();

    // create a user's item list
    const itemList = await Item.get(user.id);

    // add type guard for fulfilled promises
    const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

    // declare promise array
    const promiseArr = [];

    // fill that promise array with each item's transactions
    for (let i = 0; i < itemList.length; i++) {
        promiseArr.push(Plaid.getTransactions(itemList[i].token));
    }

    try {
        // promises work in parallel, and return a status (fulfilled/rejected) with a value or reason
        const results = await Promise.allSettled(promiseArr);

        // filter the results for just the fulfilled Promises
        const fulfillments = results?.find(isFulfilled)?.value;

        // sort the transaction lists by the most recent to least recent
        fulfillments?.sort((a: any, b: any) => a.createdAt - b.createdAt);

        // if no transactions were found, return a 40
        if (!fulfillments?.length) {
            return response.create(status.notFound, "No transactions found.");
        }

        // return the list of all transactions for all items
        return response.create(status.ok, "Transaction merge successful", fulfillments);
    } catch (err) {
        console.error((err as Error).message);
        response.create(500, "Promises fullfilment failure.");
    }
}
