import { Router } from 'express';
import linkTokenRouter from './link-token/link-token.route';
import exchangeTokenRouter from './exchange-token/exchange-token.route';

const plaidRouter = Router();

plaidRouter.use("/link-token", linkTokenRouter);
plaidRouter.use("/exchange-token", exchangeTokenRouter);

export default plaidRouter;