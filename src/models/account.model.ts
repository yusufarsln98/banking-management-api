import mongoose from 'mongoose';

/*
  - `_id` (ObjectId): Unique identifier for the account (primary key).
  - `customerId` (ObjectId): Reference to the customer document this account belongs to (foreign key).
  - `branchId` (ObjectId): Reference to the branch document this account belongs to (foreign key).
  - `accountNumber` (String): Unique account number for identification.
  - `balance` (Decimal): Current balance of the account.
  - `openingDate` (Date): Date the account was opened.
*/

export interface IAccount {
  _id: mongoose.Types.ObjectId;
  accountNumber: string;
  customerId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  balance: number;
  openingDate: Date;
}

const accountSchema = new mongoose.Schema<IAccount>({
  accountNumber: String,
  customerId: mongoose.Schema.Types.ObjectId,
  branchId: mongoose.Schema.Types.ObjectId,
  balance: Number,
  openingDate: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
