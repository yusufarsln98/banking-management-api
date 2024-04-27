import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import route_template from './route_template';
import customer from './customer';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Banking Management System API V1 🚀',
  });
});

router.use('/customer', customer);
router.use('/template', route_template);

export default router;
