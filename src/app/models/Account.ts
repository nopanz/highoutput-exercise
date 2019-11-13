import { model, Schema, Document } from 'mongoose';
import { IBalance } from './Balance';

export interface IAccount extends Document {
  id: string;
  balance: number;
  reservedBalance?: [object];
  virtualBalance?: [object];
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
  reservedBalance: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Balances',
    },
  ],
  virtualBalance: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Balances',
    },
  ],
};

const accountsSchema = new Schema(schema, { timestamps: true });

export default model<IAccount>('Accounts', accountsSchema);
