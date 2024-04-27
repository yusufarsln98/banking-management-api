/* eslint-disable @typescript-eslint/indent */
import express from 'express';
import Transaction, { ITransaction } from '../../models/transaction.model';
import { DeleteResult } from 'mongodb';
import ErrorResponse from '../../interfaces/ErrorResponse';

const router = express.Router();

router.get<{}, ITransaction[] | ErrorResponse | null>('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

router.get<{ id: string }, ITransaction | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      res.json(transaction);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.post<{}, ITransaction | ErrorResponse | null>('/', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.json(transaction);
  } catch (error: ErrorResponse | any) {
    res.status(400).json({ message: error.message, stack: error.stack });
  }
});

router.put<{ id: string }, ITransaction | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      res.json(transaction);
    } catch (error: ErrorResponse | any) {
      res.status(400).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{}, DeleteResult | ErrorResponse | null>(
  '/all',
  async (req, res) => {
    try {
      const transactions = await Transaction.deleteMany({});
      res.json(transactions);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{ id: string }, ITransaction | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const transaction = await Transaction.findByIdAndDelete(req.params.id);
      res.json(transaction);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

export default router;
