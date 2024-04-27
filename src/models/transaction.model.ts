import mongoose from 'mongoose';

/*
    - `_id` (ObjectId): Unique identifier for the transaction (primary key).
    - `accountId` (ObjectId): Reference to the account document this transaction belongs to (foreign key).
    - `transactionType` (String): Type of transaction (e.g., deposit, withdrawal, transfer).
    - `amount` (Decimal): Amount of the transaction.
    - `timestamp` (ISODate): Date and time the transaction occurred.
    - `description` (String): Optional description of the transaction.
*/

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  transactionType: string;
  amount: number;
  timestamp: Date;
  description?: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  accountId: mongoose.Schema.Types.ObjectId,
  transactionType: String,
  amount: Number,
  timestamp: Date,
  description: String,
});

const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema,
);

export default Transaction;
