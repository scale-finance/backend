import { Router } from 'express';
import { createLinkToken } from './link-token.controller';

const linkTokenRouter = Router();

linkTokenRouter.get("/create", createLinkToken);

export default linkTokenRouter;