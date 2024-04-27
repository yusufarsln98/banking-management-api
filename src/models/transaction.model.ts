import mongoose from 'mongoose';

/*
    - `_id` (ObjectId): Unique identifier for the transaction (primary key).
    - `transactionParties: {
        - `sender` (ObjectId): ID of the account that sent the transaction.
        - `recipient` (ObjectId): ID of the account that received the transaction.
      }` (Object): Nested object containing the sender and recipient account IDs.
    - `amount` (Decimal): Amount of the transaction.
    - `timestamp` (ISODate): Date and time the transaction occurred.
    - `description` (String): Optional description of the transaction.
*/

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  transactionParties: {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
  };
  amount: number;
  timestamp: Date;
  description?: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  transactionParties: {
    sender: mongoose.Schema.Types.ObjectId,
    recipient: mongoose.Schema.Types.ObjectId,
  },
  amount: Number,
  timestamp: Date,
  description: String,
});

const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema,
);

export default Transaction;
