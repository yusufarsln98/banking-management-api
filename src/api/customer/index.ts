/* eslint-disable @typescript-eslint/indent */
import express from 'express';
import Customer, { ICustomer } from '../../models/customer.model';
import { DeleteResult } from 'mongodb';
import ErrorResponse from '../../interfaces/ErrorResponse';
import Account, { IAccount } from '../../models/account.model';
import Transaction, { ITransaction } from '../../models/transaction.model';

const router = express.Router();

router.get<{}, ICustomer[] | ErrorResponse | null>('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

// identify customers with the highest number of transactions.
router.get<{}, ICustomer[] | ErrorResponse | null>(
  '/highest-num-transactions',
  async (req, res) => {
    try {
      /**
       * Retrieves a list of customers with their associated accounts and transactions.
       * @returns {Promise<Array<Customer>>} A promise that resolves to an array of customers.
       */
      const customers = await Customer.aggregate([
        {
          $lookup: {
            from: 'accounts',
            localField: '_id',
            foreignField: 'customerId',
            as: 'accounts',
          },
        },
        {
          $lookup: {
            from: 'transactions',
            localField: 'accounts._id',
            foreignField: 'accountId',
            as: 'transactions',
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: '$contactInfo.email',
            transactions: { $size: '$transactions' },
          },
        },
        {
          $sort: { transactions: -1 },
        },
      ]);

      // get the array of customers with the highest number of transactions
      // if there are multiple customers with the same highest number of transactions
      // get all of them
      let highestTransactions: ICustomer[] = [];
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].transactions === customers[0].transactions) {
          highestTransactions.push(customers[i]);
        } else {
          break;
        }
      }

      res.json(highestTransactions);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.get<{ id: string }, ICustomer | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.json(customer);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

// Find the total balance of a customer across all accounts.
router.get<
  { id: string },
  (ICustomer & { totalBalance: number }) | ErrorResponse | null
>('/totalBalance/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select(
      '_id firstName lastName contactInfo.email',
    );
    if (!customer) {
      throw new Error('Customer not found');
    }

    const accounts = await Account.find({
      customerId: req.params.id,
    });
    const totalBalance = accounts.reduce(
      (acc, account) => acc + account.balance,
      0,
    );
    res.json({ ...customer.toJSON(), totalBalance });
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

// get all accounts of a customer
router.get<{ id: string }, IAccount[] | ErrorResponse | null>(
  '/:id/accounts',
  async (req, res) => {
    try {
      const accounts = await Account.find({ customerId: req.params.id });
      res.json(accounts);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

// get all transactions of a customer in his/her all accounts
router.get<{ id: string }, ITransaction[] | ErrorResponse | null>(
  '/:id/transactions',
  async (req, res) => {
    try {
      const accounts = await Account.find({ customerId: req.params.id });
      const transactions = await Transaction.find({
        $or: [
          { accountId: { $in: accounts.map((acc) => acc._id) } },
          { recipientId: { $in: accounts.map((acc) => acc._id) } },
        ],
      });
      res.json(transactions);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.post<{}, ICustomer | ErrorResponse | null>('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.json(customer);
  } catch (error: ErrorResponse | any) {
    res.status(400).json({ message: error.message, stack: error.stack });
  }
});

router.put<{ id: string }, ICustomer | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      res.json(customer);
    } catch (error: ErrorResponse | any) {
      res.status(400).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{}, DeleteResult | ErrorResponse | null>(
  '/all',
  async (req, res) => {
    try {
      const customers = await Customer.deleteMany({});
      res.json(customers);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{ id: string }, ICustomer | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (customer) {
        await Account.deleteMany({ customerId: customer._id });
      }
      res.json(customer);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

export default router;
