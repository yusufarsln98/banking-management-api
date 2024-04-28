/* eslint-disable @typescript-eslint/indent */
import express from 'express';
import Account, { IAccount } from '../../models/account.model';
import { DeleteResult } from 'mongodb';
import ErrorResponse from '../../interfaces/ErrorResponse';
import Customer, { ICustomer } from '../../models/customer.model';
import Transaction, { ITransaction } from '../../models/transaction.model';

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

// owner of the account
router.get<{ id: string }, ICustomer | ErrorResponse | null>(
  '/:id/customer',
  async (req, res) => {
    try {
      const account = await Account.findById(req.params.id).select(
        'customerId',
      );
      const customer = await Customer.findById(account?.customerId);
      res.json(customer);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

// get transactions of an account
router.get<{ id: string }, ITransaction[] | ErrorResponse | null>(
  '/:id/transactions',
  async (req, res) => {
    try {
      // if accountId or recepientId matches the accountId param
      const transactions = await Transaction.find({
        $or: [{ accountId: req.params.id }, { recipientId: req.params.id }],
      });
      res.json(transactions);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

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
