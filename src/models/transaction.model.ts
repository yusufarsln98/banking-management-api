import mongoose, { InferSchemaType } from 'mongoose';

/*
  - `_id` (ObjectId): Unique identifier for the transaction (primary key).
  - `transactionParties: {
    - `senderId` (ObjectId): ID of the account that sent the transaction.
    - `recipientId` (ObjectId): ID of the account that received the transaction.
    }` (Object): Nested object containing the sender and recipient account IDs.
  - `accountId` (ObjectId): ID of the account that the transaction is associated with.
  - `transactionType` (String): Type of the transaction (e.g., 'deposit', 'withdrawal', 'transfer').
  - `amount` (Decimal): Amount of the transaction.
  - `timestamp` (ISODate): Date and time the transaction occurred.
  - `description` (String): Optional description of the transaction.
*/

// enum type for transactionType
export enum TransactionType {
  Withdrawal = 'withdrawal',
  Deposit = 'deposit',
  Transfer = 'transfer',
}

const transactionSchema = new mongoose.Schema({
  accountId: mongoose.Schema.Types.ObjectId,
  transactionType: {
    type: String,
    enum: Object.values(TransactionType),
  },
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

const Transaction = mongoose.model('Transaction', transactionSchema);

export type ITransaction = InferSchemaType<typeof transactionSchema>;

export default Transaction;
