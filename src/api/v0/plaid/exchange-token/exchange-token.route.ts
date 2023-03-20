import { Router } from 'express';
import { exchangePublicToken } from './exchange-token.controller';

const exchangeTokenRouter = Router();

exchangeTokenRouter.post("/", exchangePublicToken);

export default exchangeTokenRouter;