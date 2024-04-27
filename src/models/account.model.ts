import mongoose from 'mongoose';

/*
    - `_id` (ObjectId): Unique identifier for the account (primary key).
    - `customerId` (ObjectId): Reference to the customer document this account belongs to (foreign key).
    - `accountNumber` (String): Unique account number for identification.
    - `balance` (Decimal): Current balance of the account.
    - `openingDate` (Date): Date the account was opened.
    - `transactions` (Array of ObjectIds): References to transaction documents associated with this account (optional, for scalability).
*/

export interface IAccount {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  accountNumber: string;
  balance: number;
  openingDate: Date;
  transactions: mongoose.Types.ObjectId[];
}

const accountSchema = new mongoose.Schema<IAccount>({
  customerId: mongoose.Schema.Types.ObjectId,
  accountNumber: String,
  balance: Number,
  openingDate: Date,
  transactions: [mongoose.Schema.Types.ObjectId],
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
