import { Router } from 'express';
import linkTokenRouter from './link-token/link-token.route';
import exchangeTokenRouter from './exchange-token/exchange-token.route';
import transactionsRouter from './transactions/transactions.route';

const plaidRouter = Router();

plaidRouter.use("/link-token", linkTokenRouter);
plaidRouter.use("/exchange-token", exchangeTokenRouter);
plaidRouter.use("/transactions", transactionsRouter);

export default plaidRouter;
