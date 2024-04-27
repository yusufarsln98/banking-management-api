/* eslint-disable @typescript-eslint/indent */
import express from 'express';
import Account, { IAccount } from '../../models/account.model';
import { DeleteResult } from 'mongodb';
import ErrorResponse from '../../interfaces/ErrorResponse';

const router = express.Router();

router.get<{}, IAccount[] | ErrorResponse | null>('/', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

router.get<{ id: string }, IAccount | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const account = await Account.findById(req.params.id);
      res.json(account);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

// Find the total balance of a customer across all accounts.
router.get<
  { customerId: string },
  { totalBalance: number } | ErrorResponse | null
>('/totalBalance/:customerId', async (req, res) => {
  try {
    const accounts = await Account.find({
      customerId: req.params.customerId,
    });
    const totalBalance = accounts.reduce(
      (acc, account) => acc + account.balance,
      0,
    );
    res.json({ totalBalance });
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

router.post<{}, IAccount | ErrorResponse | null>('/', async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.json(account);
  } catch (error: ErrorResponse | any) {
    res.status(400).json({ message: error.message, stack: error.stack });
  }
});

router.put<{ id: string }, IAccount | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(account);
    } catch (error: ErrorResponse | any) {
      res.status(400).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{}, DeleteResult | ErrorResponse | null>(
  '/all',
  async (req, res) => {
    try {
      const accounts = await Account.deleteMany({});
      res.json(accounts);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{ id: string }, IAccount | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const account = await Account.findByIdAndDelete(req.params.id);
      res.json(account);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

export default router;
