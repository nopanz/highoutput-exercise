import { model, Schema , Document } from 'mongoose';

export interface IBalance extends Document {
  balance: number;
  context?: string;
  type: string;
}

const schema = {
  balance: { type: Number, default: 0 },
  context: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    enum: ['current', 'reserved', 'virtual'],
  },
};
const balancesSchema = new Schema(schema, { timestamps: true });

export default model<IBalance>('Balances', balancesSchema);
