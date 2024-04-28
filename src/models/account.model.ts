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
        const Customer = mongoose.model('Customer');
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
        const Branch = mongoose.model('Branch');
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

export type IAccount = InferSchemaType<typeof accountSchema>;

export default Account;
