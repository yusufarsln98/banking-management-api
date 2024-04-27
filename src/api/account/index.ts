/* eslint-disable @typescript-eslint/indent */
import express from 'express';
import Account, { IAccount } from '../../models/account.model';
import { DeleteResult } from 'mongodb';

const router = express.Router();

router.get<{}, IAccount[]>('/', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

router.get<{ id: string }, IAccount | null>('/:id', async (req, res) => {
  const account = await Account.findById(req.params.id);
  res.json(account);
});

// Find the total balance of a customer across all accounts.
router.get<{ customerId: string }, number>(
  '/totalBalance/:customerId',
  async (req, res) => {
    const accounts = await Account.find({ customerId: req.params.customerId });
    const totalBalance = accounts.reduce(
      (acc, account) => acc + account.balance,
      0,
    );
    res.json(totalBalance);
  },
);

router.post<{}, IAccount, IAccount>('/', async (req, res) => {
  const account = await Account.create(req.body);
  res.json(account);
});

router.put<{ id: string }, IAccount | null, IAccount>(
  '/:id',
  async (req, res) => {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(account);
  },
);

router.delete<{}, DeleteResult>('/all', async (req, res) => {
  const accounts = await Account.deleteMany({});
  res.json(accounts);
});

router.delete<{ id: string }, IAccount | null>('/:id', async (req, res) => {
  const account = await Account.findByIdAndDelete(req.params.id);
  res.json(account);
});

export default router;
