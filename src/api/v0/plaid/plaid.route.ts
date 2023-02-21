import { Router } from 'express';
import linkTokenRouter from './link-token/link-token.route';

const plaidRouter = Router();

plaidRouter.use("/link-token", linkTokenRouter);

export default plaidRouter;