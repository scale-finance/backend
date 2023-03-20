import type { Handler } from "express";
import { Response } from "../../../../models";
import { ItemPublicTokenExchangeResponse } from "plaid";
import Plaid from "../../../../models/Plaid";
import Item from "../../../../models/Item";

export const exchangePublicToken: Handler = async (req, res) => {
    // create response object
    const response = new Response<ItemPublicTokenExchangeResponse["data"]>(res);

    // get the public token
    const publicToken = req.body.publicToken;
    if (!publicToken) return response.create(400, "Public token is required.");

    // get user from from the response data
    const user = response.getUser();

    // exchange the public token to store the access token
    try {
        const exchangeResponse = await Plaid.exchangePublicToken(publicToken);
        await Item.create(user.id, exchangeResponse.access_token);
        response.create(200, "Public token exchanged, access token received", exchangeResponse);
    } catch (err) {
        console.error((err as Error).message);
        response.create(500, "Could not exchange public token.");
    }
};
