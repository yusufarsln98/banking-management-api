import mongoose, { InferSchemaType } from 'mongoose';
import Account from './account.model';

/*
  - `_id` (ObjectId): Unique identifier for the transaction (primary key).
  - `accountId` (ObjectId): ID of the account that the transaction is associated with.
  - `recipientId` (ObjectId): ID of the account that received the transaction. (Only for 'transfer' transactions)
  - `transactionType` (String): Type of the transaction (e.g., 'deposit', 'withdrawal', 'transfer').
  - `amount` (Decimal): Amount of the transaction.
  - `timestamp` (ISODate): Date and time the transaction occurred.
  - `description` (String): Optional description of the transaction.
*/

// enum type for transactionType
enum TransactionType {
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

type ITransaction = InferSchemaType<typeof transactionSchema>;

// trigger a post save hook to update the account balance
transactionSchema.post('save', async function (transaction: ITransaction) {
  // check if transactionType is 'transfer' or 'withdrawal'
  if (
    transaction.transactionType === TransactionType.Transfer ||
    transaction.transactionType === TransactionType.Withdrawal
  ) {
    // reduce the amount from the account if enough balance
    const account = await Account.findById(transaction.accountId);
    const balance = account?.balance || 0;
    if (balance < transaction.amount) {
      throw new Error('Insufficient balance');
    }
    account!.balance -= transaction.amount;
    await account?.save();
  }

  // if transactionType is 'transfer', add the amount to the recipient account
  if (transaction.transactionType === TransactionType.Transfer) {
    await Account.findByIdAndUpdate(
      transaction.recipientId,
      {
        $inc: { balance: transaction.amount },
      },
      { new: true },
    );
  } else if (transaction.transactionType === TransactionType.Deposit) {
    await Account.findByIdAndUpdate(
      transaction.accountId,
      {
        $inc: { balance: transaction.amount },
      },
      { new: true },
    );
  }
});

export { ITransaction, TransactionType };

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
