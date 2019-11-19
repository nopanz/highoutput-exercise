import { model, Schema, Document } from 'mongoose';

export interface Balance extends Document {
  balance: number;
  context?: string;
  type: string;
  account: string;
}

const schema = {
  balance: { type: Number, default: 0 },
  context: {
    type: String,
  },
  type: {
    type: String,
    enum: ['reserved', 'virtual'],
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Accounts',
  },
};
const balancesSchema = new Schema(schema, { timestamps: true });

export default model<Balance>('Balances', balancesSchema);
