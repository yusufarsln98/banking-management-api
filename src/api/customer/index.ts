import express from 'express';
import Customer, { ICustomer } from '../../models/customer.model';
import { DeleteResult } from 'mongodb';
import ErrorResponse from '../../interfaces/ErrorResponse';
import Account from '../../models/account.model';

const router = express.Router();

router.get<{}, ICustomer[] | ErrorResponse | null>('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

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
