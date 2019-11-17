import Operation from './Operation';
import Account from '../models/Account';
import Balance from '../models/Balance';
import AppError from '../graphql/AppError';

enum BALANCE_TYPE {
  RESERVED = 'reserved',
  VIRTUAL = 'virtual'
}

interface AccountsOperation {
  account?: string;
  delta?: number;
  context?: string;
  amount: number;
}

class AccountsOperation extends Operation implements AccountsOperation {
  get jsonSchema() {
    const { UPDATE_BALANCE, CREATE_RESERVED_BALANCE } = AccountsOperation.scenarios;
    const schama = {
      [UPDATE_BALANCE]: {
        properties: {
          delta: {
            type: 'number',
          },
        },
        required: ['account', 'delta'],
      },
      [CREATE_RESERVED_BALANCE]: {
        properties: {
          context: {
            type: 'string',
          },
          amount: {
            type: 'number',
          },
        },
        required: ['account', 'context', 'amount'],
      },
    };

    const common = {
      properties: {
        account: {
          type: 'string',
        },
      },
    };
    return this.setSchema(common, schama);
  }

  static get scenarios() {
    return {
      UPDATE_BALANCE: 'update-balance',
      CREATE_RESERVED_BALANCE: 'createReservedBalance',
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

  async createReservedBalance() {
    this.scenario = AccountsOperation.scenarios.CREATE_RESERVED_BALANCE;
    this.validate();
    const account = await Account.findOne({ id: this.account }).exec();
    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }

    let balance = await Balance.findOne({ account: account._id, context: this.context }).exec();
    if (balance) {
      throw new AppError(`Reserved Balance with context "${this.context}" already exist`, AppError.CODE.E_ITEM_EXIST);
    }

    if ((account.balance - this.amount) < 0) {
      throw new AppError('Invalid amount', AppError.CODE.E_INVALID_INPUT);
    }

    balance = new Balance({
      type:
      BALANCE_TYPE.RESERVED,
      context: this.context,
      account: account._id,
      balance: this.amount,
    });

    account.balance -= this.amount;
    await account.save();

    return balance.save().then((result) => result.populate('account').execPopulate());
  }
}

export default AccountsOperation;
