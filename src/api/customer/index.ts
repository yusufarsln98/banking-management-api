import express from 'express';
import Customer, { ICustomer } from '../../models/customer.model';
import { DeleteResult } from 'mongodb';

const router = express.Router();

router.get<{}, ICustomer[]>('/', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

router.post<{}, ICustomer, ICustomer>('/', async (req, res) => {
  const customer = await Customer.create(req.body);
  res.json(customer);
});

router.get<{ id: string }, ICustomer | null>('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  res.json(customer);
});

router.put<{ id: string }, ICustomer | null, ICustomer>(
  '/:id',
  async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(customer);
  },
);

router.delete<{}, DeleteResult>('/all', async (req, res) => {
  const customers = await Customer.deleteMany({});
  res.json(customers);
});

router.delete<{ id: string }, ICustomer | null>('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  res.json(customer);
});

export default router;
