import mongoose from 'mongoose';

/*
    - `_id` (ObjectId): Unique identifier for the customer (primary key).
    - `firstName` (String): Customer's first name.
    - `lastName` (String): Customer's last name.
    - `dateOfBirth` (Date): Customer's date of birth.
    - `contactInfo` (Object): Nested object containing:
        - `phoneNumbers` (Array of Strings): List of customer phone numbers.
        - `email` (String): Customer's email address.
    - `address` (Object): Same structure as before (streetAddress, city, state, postalCode).
*/

export interface ICustomer {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  contactInfo: {
    phoneNumbers: string[];
    email: string;
    address: {
      streetAddress: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };
}

const customerSchema = new mongoose.Schema<ICustomer>({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  contactInfo: {
    phoneNumbers: [String],
    email: String,
    address: {
      streetAddress: String,
      city: String,
      state: String,
      postalCode: String,
    },
  },
});

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
