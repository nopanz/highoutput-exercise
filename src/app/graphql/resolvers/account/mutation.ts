
import Account from '@app/models/Account';
import Balance from '@app/models/Balance';
import AppError from '@app/graphql/AppError';

export enum BALANCE_TYPE {
  RESERVED = 'reserved',
  VIRTUAL = 'virtual'
}

export default {
  Mutation: {
    updateBalance: async (root: object, args: {account: string; delta: number}) => {
      let account = await Account.findOne({ id: args.account }).exec();
      if (!account) {
        account = new Account({ id: args.account, balance: 0 });
      }
      const updatedBalance: number = account.balance + (args.delta || 0);
      if (updatedBalance >= 0) {
        account.balance = updatedBalance;
        await account.save();
      } else {
        throw new AppError('Invalid Balance', AppError.CODE.E_INVALID_INPUT);
      }
      return true;
    },
    createReservedBalance: async (
      root: object,
      args: {account: string; context: string; amount: number},
    ) => {
      const account = await Account.findOne({ id: args.account }).exec();
      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }

      let balance = await Balance.findOne({
        account: account._id,
        context: args.context,
        type: BALANCE_TYPE.RESERVED,
      }).exec();

      if (balance) {
        throw new AppError(`Reserved Balance with context "${args.context}" already exist`, AppError.CODE.E_ITEM_EXIST);
      }

      if ((account.balance - args.amount) < 0) {
        throw new AppError('Invalid amount', AppError.CODE.E_INVALID_INPUT);
      }

      balance = new Balance({
        type:
              BALANCE_TYPE.RESERVED,
        context: args.context,
        account: account._id,
        balance: args.amount,
      });
      account.balance -= args.amount;
      await account.save();
      await balance.save();
      return true;
    },
    updateReservedBalance: async (root: object,
      args: {account: string; context: string; delta: number},
    ) => {
      const account = await Account.findOne({ id: args.account }).exec();

      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }

      const balance = await Balance.findOne({
        account: account._id,
        context: args.context,
        type: BALANCE_TYPE.RESERVED,
      }).exec();

      if (!balance) {
        throw new AppError(`Reserved Balance with context "${args.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
      }

      if ((balance.balance + (args.delta)) < 0) {
        throw new AppError('Invalid amount', AppError.CODE.E_INVALID_INPUT);
      }
      balance.balance += (args.delta);
      await balance.save();
      return true;
    },
    releaseReservedBalance: async (root: object, args:
    {account: string; context: string}) => {
      const account = await Account.findOne({ id: args.account }).exec();

      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }
      const balance = await Balance.findOne({
        account: account._id,
        context: args.context,
        type: BALANCE_TYPE.RESERVED,
      }).exec();

      if (!balance) {
        throw new AppError(`Reserved Balance with context "${args.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
      }

      account.balance += balance.balance;
      await account.save();

      await Balance.findByIdAndDelete(balance._id).exec();
      return true;
    },
    updateVirtualBalance: async (root: object,
      args: {account: string; context: string; delta: number}) => {
      const account = await Account.findOne({ id: args.account }).exec();
      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }

      let balance = await Balance.findOne({
        account: account._id,
        context: args.context,
        type: BALANCE_TYPE.VIRTUAL,
      }).exec();

      if (!balance) {
        balance = new Balance({
          account: account._id,
          context: args.context,
          type: BALANCE_TYPE.VIRTUAL,
        });
      }

      if ((balance.balance + (args.delta)) < 0) {
        throw new AppError('Invalid amount', AppError.CODE.E_INVALID_INPUT);
      }

      balance.balance += (args.delta);

      await balance.save();
      return true;
    },
    cancelVirtualBalance: async (root: object,
      args: {account: string; context: string}) => {
      const account = await Account.findOne({ id: args.account }).exec();

      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }
      const balance = await Balance.findOne({
        account: account._id,
        context: args.context,
        type: BALANCE_TYPE.VIRTUAL,
      }).exec();

      if (!balance) {
        throw new AppError(`Virtual Balance with context "${args.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
      }
      await Balance.findByIdAndDelete(balance._id).exec();
      return true;
    },
    commitVirtualBalance: async (root: object, args:
    {account: string; context: string}) => {
      const account = await Account.findOne({ id: args.account }).exec();

      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }
      const balance = await Balance.findOne({
        account: account._id,
        context: args.context,
        type: BALANCE_TYPE.VIRTUAL,
      }).exec();

      if (!balance) {
        throw new AppError(`Virtual Balance with context "${args.context}" does not exist`, AppError.CODE.E_ITEM_NOT_FOUND);
      }

      account.balance += balance.balance;
      await account.save();

      await Balance.findByIdAndDelete(balance._id).exec();
      return true;
    },
  },
};
