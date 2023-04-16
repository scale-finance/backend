import { Router } from 'express';
import { getAllAccountsData, getAllTransactions } from './transactions.controller';

const transactionsRouter = Router();

transactionsRouter.get('/all', getAllTransactions);
transactionsRouter.get('/accounts', getAllAccountsData);

export default transactionsRouter;

