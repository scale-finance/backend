import { Router } from 'express';
import { getAllTransactions } from './transactions.controller';

const transactionsRouter = Router();

transactionsRouter.get('/all', getAllTransactions);

export default transactionsRouter;

