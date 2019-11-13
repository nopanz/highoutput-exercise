import { model, Schema } from 'mongoose';

const balancesSchema = new Schema({
  balance: Schema.Types.Decimal128,
  context: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    enum: ['current', 'reserved', 'virtual'],
  },
});

export default model('Balances', balancesSchema);
