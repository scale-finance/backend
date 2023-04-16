import { Router } from 'express';
import { getAllAccountsData } from './accounts.controller';

const accountsRouter = Router();

accountsRouter.get('/all', getAllAccountsData);

export default accountsRouter;

