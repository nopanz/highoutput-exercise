import Account, { Account as AccountInterface } from '@app/models/Account';
import Balance from '@app/models/Balance';
import AppError from '@app/graphql/AppError';

export enum BALANCE_TYPE {
  RESERVED = 'reserved',
  VIRTUAL = 'virtual'
}

interface AccountsOperation {
  account: string;
  delta: number;
  context?: string;
  amount: number;
  first: number;
  after: string;
}

interface AccountEdge {
  cursor: string;
  node: AccountInterface;
}

class AccountsOperation implements AccountsOperation {
  async getAccount() {
    const account = await Account.findOne({ id: this.account }).exec();
    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }
    return account.toJSON();
  }

  async listAccounts() {
    let accounts: AccountInterface[];
    let hasNextPage = false;

    if (this.after) {
      accounts = await Account.find({ _id: { $gt: this.after } }).limit(this.first + 1);
    } else {
      accounts = await Account.find().limit(this.first + 1);
    }

    if (accounts.length > this.first) {
      accounts.pop();
      hasNextPage = true;
    }

    const edges: AccountEdge [] = accounts.map((account) => ({
      node: account,
      cursor: account._id,
    }));

    const lastItem = accounts.pop();

    const count = await Account.countDocuments().exec();
    return {
      totalCount: count,
      edges,
      pageInfo: {
        endCursor: (lastItem && lastItem._id) || null,
        hasNextPage,
      },
    };
  }

  async updateBalance() {
    let account = await Account.findOne({ id: this.account }).exec();
    if (!account) {
      account = new Account({ id: this.account, balance: 0 });
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
    const account = await Account.findOne({ id: this.account }).exec();
    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }

    let balance = await Balance.findOne({
      account: account._id,
      context: this.context,
      type: BALANCE_TYPE.RESERVED,
    }).exec();

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

  async updateReservedBalance() {
    const account = await Account.findOne({ id: this.account }).exec();

    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }

    const balance = await Balance.findOne({
      account: account._id,
      context: this.context,
      type: BALANCE_TYPE.RESERVED,
    }).exec();

    if (!balance) {
      throw new AppError(`Reserved Balance with context "${this.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
    }

    if ((balance.balance + (this.delta)) < 0) {
      throw new AppError('Invalid amount', AppError.CODE.E_INVALID_INPUT);
    }
    balance.balance += (this.delta);
    return balance.save().then((result) => result.populate('account').execPopulate());
  }

  async releaseReservedBalance() {
    const account = await Account.findOne({ id: this.account }).exec();

    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }
    const balance = await Balance.findOne({
      account: account._id,
      context: this.context,
      type: BALANCE_TYPE.RESERVED,
    }).exec();

    if (!balance) {
      throw new AppError(`Reserved Balance with context "${this.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
    }

    account.balance += balance.balance;
    await account.save();

    await Balance.findByIdAndDelete(balance._id).exec();
  }

  async updateVirtualBalance() {
    const account = await Account.findOne({ id: this.account }).exec();
    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }

    let balance = await Balance.findOne({
      account: account._id,
      context: this.context,
      type: BALANCE_TYPE.VIRTUAL,
    }).exec();

    if (!balance) {
      balance = new Balance({
        account: account._id,
        context: this.context,
        type: BALANCE_TYPE.VIRTUAL,
      });
    }

    if ((balance.balance + (this.delta)) < 0) {
      throw new AppError('Invalid amount', AppError.CODE.E_INVALID_INPUT);
    }

    balance.balance += (this.delta);

    await balance.save();
  }

  async cancelVirtualBalance() {
    const account = await Account.findOne({ id: this.account }).exec();

    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }
    const balance = await Balance.findOne({
      account: account._id,
      context: this.context,
      type: BALANCE_TYPE.VIRTUAL,
    }).exec();

    if (!balance) {
      throw new AppError(`Virtual Balance with context "${this.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
    }
    await Balance.findByIdAndDelete(balance._id).exec();
  }

  async commitVirtualBalance() {
    const account = await Account.findOne({ id: this.account }).exec();

    if (!account) {
      throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
    }
    const balance = await Balance.findOne({
      account: account._id,
      context: this.context,
      type: BALANCE_TYPE.VIRTUAL,
    }).exec();

    if (!balance) {
      throw new AppError(`Virtual Balance with context "${this.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
    }

    account.balance += balance.balance;
    await account.save();

    await Balance.findByIdAndDelete(balance._id).exec();
  }
}

export default AccountsOperation;
