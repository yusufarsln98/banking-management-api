/* eslint-disable @typescript-eslint/indent */
import express from 'express';
import Branch, { IBranch } from '../../models/branch.model';
import { DeleteResult } from 'mongodb';
import ErrorResponse from '../../interfaces/ErrorResponse';

const router = express.Router();

router.get<{}, IBranch[] | ErrorResponse | null>('/', async (req, res) => {
  try {
    const branchs = await Branch.find();
    res.json(branchs);
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

router.get<
  {},
  { branch: IBranch; totalAccounts: number }[] | ErrorResponse | null
>('/accounts', async (req, res) => {
  try {
    const branchsWithTotalAccounts = await Branch.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: 'branchId',
          as: 'accounts',
        },
      },
      {
        $project: {
          _id: true,
          totalAccounts: { $size: '$accounts' },
          branchName: true,
        },
      },
    ]);
    res.json(branchsWithTotalAccounts);
  } catch (error: ErrorResponse | any) {
    res.status(404).json({ message: error.message, stack: error.stack });
  }
});

router.get<{ id: string }, IBranch | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const branch = await Branch.findById(req.params.id);
      res.json(branch);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.post<{}, IBranch | ErrorResponse | null>('/', async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.json(branch);
  } catch (error: ErrorResponse | any) {
    res.status(400).json({ message: error.message, stack: error.stack });
  }
});

router.put<{ id: string }, IBranch | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(branch);
    } catch (error: ErrorResponse | any) {
      res.status(400).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{}, DeleteResult | ErrorResponse | null>(
  '/all',
  async (req, res) => {
    try {
      const branchs = await Branch.deleteMany({});
      res.json(branchs);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

router.delete<{ id: string }, IBranch | ErrorResponse | null>(
  '/:id',
  async (req, res) => {
    try {
      const branch = await Branch.findByIdAndDelete(req.params.id);
      res.json(branch);
    } catch (error: ErrorResponse | any) {
      res.status(404).json({ message: error.message, stack: error.stack });
    }
  },
);

export default router;
