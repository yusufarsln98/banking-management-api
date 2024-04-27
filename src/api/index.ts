import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import customer from './customer';
import account from './account';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Banking Management System API V1 🚀',
  });
});

router.use('/customer', customer);
router.use('/account', account);

export default router;
