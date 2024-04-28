import mongoose, { InferSchemaType } from 'mongoose';
import Customer from './customer.model';
import Branch from './branch.model';

/*
  - `_id` (ObjectId): Unique identifier for the account (primary key).
  - `accountNumber` (String): Unique account number (generated automatically by timestamp).
  - `customerId` (ObjectId): Reference to the customer document this account belongs to (foreign key).
  - `branchId` (ObjectId): Reference to the branch document this account belongs to (foreign key).
  - `balance` (Decimal): Current balance of the account.
  - `openingDate` (Date): Date the account was opened.
*/

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    unique: true,
    default: function () {
      const timestamp = Date.now();
      return timestamp.toString().padStart(10, '0');
    },
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // check if there is a customer with the given ID
    validate: {
      validator: async function (customerId: string) {
        const customer = await Customer.findById(customerId).exec();
        return !!customer;
      },
    },
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // check if there is a branch with the given ID
    validate: {
      validator: async function (branchId: string) {
        const branch = await Branch.findById(branchId).exec();
        return !!branch;
      },
    },
  },
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
export default Account;

// type of Account model for type checking
export type IAccount = InferSchemaType<typeof accountSchema>;
