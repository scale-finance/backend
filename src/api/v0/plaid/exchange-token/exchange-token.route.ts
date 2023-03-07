import { Router } from 'express';
import { exchangePublicToken } from './exchange-token.controller';

const exchangeTokenRouter = Router();

exchangeTokenRouter.get("/exchange", exchangePublicToken);

export default exchangeTokenRouter;