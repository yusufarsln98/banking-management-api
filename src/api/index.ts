import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import customer from './customer';
import account from './account';
import branch from './branch';
import transaction from './transaction';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Banking Management System API V1 🚀',
  });
});

router.use('/customer', customer);
router.use('/account', account);
router.use('/branch', branch);
router.use('/transaction', transaction);

export default router;
