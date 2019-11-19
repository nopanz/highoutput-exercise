import { model, Schema, Document } from 'mongoose';

export interface Account extends Document {
  _id: string;
  id: string;
  balance: number;
}

const schema = {
  id: {
    type: String,
    index: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
};

const accountsSchema = new Schema(schema, { timestamps: true });

export default model<Account>('Accounts', accountsSchema);
