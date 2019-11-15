import Operation from './Operation';
import Account from '../models/Account';
import AppError from '../graphql/AppError';

class AccountsOperation extends Operation {
  account?: string;

  delta?: number;

  get jsonSchema() {
    const { UPDATE_BALANCE } = AccountsOperation.scenarios;
    const schama = {
      [UPDATE_BALANCE]: {
        properties: {
          account: {
            type: 'string',
          },
          delta: {
            type: 'number',
          },
        },
        required: ['account', 'delta'],
      },
    };
    return this.setSchema(schama);
  }

  static get scenarios() {
    return {
      UPDATE_BALANCE: 'update-balance',
    };
  }

  async updateBalance() {
    this.scenario = AccountsOperation.scenarios.UPDATE_BALANCE;
    this.validate();
    let account = await Account.findOne({ id: this.account }).exec();
    if (!account) {
      account = new Account({ id: this.account });
      await account.save();
    }
    const updatedBalance: number = account.balance + (this.delta || 0);
    if (updatedBalance >= 0) {
      account.balance = updatedBalance;
      await account.save();
    } else {
      throw new AppError('Invalid Balance', AppError.CODE.E_INVALID_INPUT);
    }
    return account;
  }
}

export default AccountsOperation;
