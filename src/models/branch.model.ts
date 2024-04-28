import mongoose, { InferSchemaType } from 'mongoose';

/*
  - `_id` (ObjectId): Unique identifier for the branch (primary key).
  - `branchName` (String): Name of the branch.
  - `address` (Object): 
    - `streetAddress` (String): Branch street address.
    - `city` (String): Branch city.
    - `state` (String): Branch state/province.
    - `postalCode` (String): Branch postal code.
  - `contactInfo` (Object): 
    - `phoneNumbers` (Array of Strings): List of branch phone numbers.
    - `email` (String): Branch email address.
*/

const branchSchema = new mongoose.Schema({
  branchName: {
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
  contactInfo: {
    phoneNumbers: {
      type: [String],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
});

const Branch = mongoose.model('Branch', branchSchema);

export type IBranch = InferSchemaType<typeof branchSchema>;

export default Branch;
