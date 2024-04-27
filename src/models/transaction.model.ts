import mongoose from 'mongoose';

/*
  - `_id` (ObjectId): Unique identifier for the transaction (primary key).
  - `transactionParties: {
    - `senderId` (ObjectId): ID of the account that sent the transaction.
    - `recipientId` (ObjectId): ID of the account that received the transaction.
    }` (Object): Nested object containing the sender and recipient account IDs.
  - `amount` (Decimal): Amount of the transaction.
  - `timestamp` (ISODate): Date and time the transaction occurred.
  - `description` (String): Optional description of the transaction.
*/

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  transactionParties: {
    senderId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
  };
  amount: number;
  timestamp: Date;
  description?: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  transactionParties: {
    senderId: mongoose.Schema.Types.ObjectId,
    recipientId: mongoose.Schema.Types.ObjectId,
  },
  amount: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema,
);

export default Transaction;
