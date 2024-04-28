import mongoose, { InferSchemaType } from 'mongoose';

/*
  - `_id` (ObjectId): Unique identifier for the account (primary key).
  - `customerId` (ObjectId): Reference to the customer document this account belongs to (foreign key).
  - `branchId` (ObjectId): Reference to the branch document this account belongs to (foreign key).
  - `accountNumber` (String): Unique account number for identification.
  - `balance` (Decimal): Current balance of the account.
  - `openingDate` (Date): Date the account was opened.
*/

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    unique: true,
  },
  customerId: mongoose.Schema.Types.ObjectId,
  branchId: mongoose.Schema.Types.ObjectId,
  balance: {
    type: Number,
    default: 0,
  },
  openingDate: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.model('Account', accountSchema);

export type IAccount = InferSchemaType<typeof accountSchema>;

export default Account;
