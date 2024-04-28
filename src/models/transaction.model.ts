import mongoose, { InferSchemaType } from 'mongoose';

/*
  - `_id` (ObjectId): Unique identifier for the transaction (primary key).
  - `accountId` (ObjectId): ID of the account that the transaction is associated with.
  - `recipientId` (ObjectId): ID of the account that received the transaction.
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
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // check if there is an account with the given ID
    validate: {
      validator: async function (accountId: string) {
        const Account = mongoose.model('Account');
        const account = await Account.findById(accountId).exec();
        return !!account;
      },
    },
  },
  // optional recipientId if transactionType is 'transfer'
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function (this: any) {
      return this.transactionType === TransactionType.Transfer;
    },
    // check if there is an account with the given ID
    validate: {
      validator: async function (recipientId: string) {
        const Account = mongoose.model('Account');
        const account = await Account.findById(recipientId).exec();
        return !!account;
      },
    },
  },
  transactionType: {
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export type ITransaction = InferSchemaType<typeof transactionSchema>;

export default Transaction;
