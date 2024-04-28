import mongoose, { InferSchemaType } from 'mongoose';

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

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  contactInfo: {
    phoneNumbers: {
      type: [String],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      streetAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
  },
});

const Customer = mongoose.model('Customer', customerSchema);

export type ICustomer = InferSchemaType<typeof customerSchema>;

export default Customer;
