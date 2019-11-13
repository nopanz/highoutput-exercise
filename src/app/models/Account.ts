import { model, Schema } from 'mongoose';

const accountsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  id: {
    type: String,
    index: true,
    unique: true,
  },
  balance: {
    type: Schema.Types.ObjectId,
    ref: 'Balances',
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
});

export default model('Accounts', accountsSchema);
