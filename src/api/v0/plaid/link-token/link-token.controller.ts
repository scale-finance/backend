import type { Handler } from "express";
import { Response } from "../../../../models";
import { LinkTokenCreateResponse } from "plaid";
import Plaid from "../../../../models/Plaid";

export const createLinkToken: Handler = async (req, res) => {
    // create response object
    const response = new Response<LinkTokenCreateResponse["data"]>(res);
    const user = response.getUser(); // get user from locals

    // create link token
    try {
        const tokenResponse = await Plaid.createLinkToken(user.id);
        response.create(200, "Link token created", tokenResponse);
    } catch (err) {
        console.error((err as Error).message);
        response.create(500, "Could not create link token");
    }
};
