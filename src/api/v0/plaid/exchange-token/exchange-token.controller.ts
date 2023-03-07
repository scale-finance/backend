import type { Handler } from "express";
import { Response } from "../../../../models";
import { ItemPublicTokenExchangeResponse } from "plaid";
import Plaid from "../../../../models/Plaid";

export const exchangePublicToken: Handler = async (req, res) => {
    //get the public token???? **NEED TO CHECK***
    const publicToken = req.body as unknown as string;

    // create response object
    const response = new Response<ItemPublicTokenExchangeResponse["data"]>(res);

     // get user from from the response data
    const user = response.getUser();

    // exchange the public token to store the access token
    try {
        const exchangeResponse = await Plaid.exchangePublicToken(publicToken);
        await Plaid.getItem();
        response.create(200, "Public token exchanged, access token received", exchangeResponse);
    } catch (err) {
        console.error((err as Error).message);
        response.create(500, "Could not create exchange public token");
    }
};
