import type { Handler } from "express";
import { Response } from "../../../../models";
import Plaid from "../../../../models/Plaid";
import Item from "../../../../models/Item";
import { status } from "../../../../types/server";

interface TransactionRes {
    totalBalance: number;
    transactions: any[];
}

export const getAllTransactions: Handler = async (req, res) => {
    //create response object
    const response = new Response<TransactionRes>(res);

    // get userid from request body
    const user = response.getUser();

    // create a user's item list
    const itemList = await Item.get(user.id);

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
        const fulfillments = results?.filter(
            (settled) => settled.status === "fulfilled"
        );

        // get balance total from accounts
        const totalBalance = fulfillments?.reduce((acc, curr) => {
            (curr as any)?.value?.accounts.forEach((account: any) => {
                acc += account.balances.current;
            });
            return acc;
        }, 0);

        // join all transaction arrays into one
        const transactions = fulfillments?.reduce(
            (acc, curr) => acc.concat((curr as any)?.value?.transactions),
            []
        );

        // sort transactions by date
        transactions?.sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // if no transactions were found, return a 40
        if (!fulfillments?.length) {
            return response.create(status.notFound, "No transactions found.");
        }

        // return the list of all transactions for all items
        return response.create(status.ok, "Transaction merge successful", {
            totalBalance,
            transactions: transactions as any[],
        });
    } catch (err) {
        console.error((err as Error).message);
        response.create(500, "Promises fullfilment failure.");
    }
};

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
    const promiseArr: any[] = [];

    // fill that promise array with each item's transactions
    const data: any = {};
    itemList.forEach((item) => {
        const transactionFetch = async () => {
            // get institution id
            const institution = await item.getInstitutionData();

            // define institution data
            data[institution.institutionId] = {
                name: institution.name,
                logo: institution.logo,
                accounts: {},
            };

            // get the transactions for the item
            const response = await Plaid.getTransactions(item.token);

            // define account data
            response.accounts.forEach((account: any) => {
                data[institution.institutionId].accounts[account.account_id] = {
                    name: account.name,
                    type: account.type,
                    transactions: [],
                };
            });

            // push the transactions to the account
            response.transactions.forEach((transaction: any) => {
                // push the transaction to the account
                data[institution.institutionId].accounts[
                    transaction.account_id
                ].transactions.push(transaction);
            });
        };

        promiseArr.push(transactionFetch());
    });

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
