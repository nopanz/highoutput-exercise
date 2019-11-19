import { Account } from '@app/models/Account';
import AccountsOperation from '../operations/AccountsOperation';
import Loader from './Loader';

export default {
  Mutation: {
    updateBalance: async (root: object, { account, delta }: {account: string; delta: number}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.delta = delta;
      await op.updateBalance();
      return true;
    },
    createReservedBalance: async (root: object, { account, context, amount }:
    {account: string; context: string; amount: number}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.amount = amount;
      op.context = context;
      await op.createReservedBalance();
      return true;
    },
    updateReservedBalance: async (root: object, { account, context, delta }:
    {account: string; context: string; delta: number}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.delta = delta;
      op.context = context;
      await op.updateReservedBalance();
      return true;
    },
    releaseReservedBalance: async (root: object, { account, context }:
    {account: string; context: string}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.context = context;
      await op.releaseReservedBalance();
      return true;
    },
    updateVirtualBalance: async (root: object, { account, context, delta }:
    {account: string; context: string; delta: number}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.delta = delta;
      op.context = context;
      await op.updateVirtualBalance();
      return true;
    },
    cancelVirtualBalance: async (root: object, { account, context }:
    {account: string; context: string}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.context = context;
      await op.cancelVirtualBalance();
      return true;
    },
    commitVirtualBalance: async (root: object, { account, context }:
    {account: string; context: string}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.context = context;
      await op.commitVirtualBalance();
      return true;
    },
  },
  Query: {
    account: async (root: object, { id }: {id: string}) => {
      const op = new AccountsOperation();
      op.account = id;
      const foundAccount = await op.getAccount();
      return foundAccount;
    },
    accounts: async (root: object, { first, after }: {first: number; after: string}) => {
      const op = new AccountsOperation();
      op.first = first;
      op.after = after;
      return op.listAccounts();
    },
  },
  Account: {
    reservedBalance: async (
      parent: Account,
      { context }: {context: string},
      { loader }: {loader: Loader},
    ) => {
      const balance = await loader.reservedBalance.load(`${context}:${parent._id}`);
      return (balance && balance.balance) || 0;
    },
    virtualBalance: async (
      parent: Account,
      { context }: {context: string},
      { loader }: {loader: Loader}) => {
      const balance = await loader.virtualBalance.load(`${context}:${parent._id}`);
      return (balance && balance.balance) || 0;
    },
    availableBalance: async (
      parent: Account,
      { context }: {context: string},
      { loader }: {loader: Loader}) => {
      let availableBalance = 0;
      const balances = await loader.availableBalance.load(`${context}:${parent._id}`);
      if (balances.length > 0) {
        availableBalance += balances.reduce((sum: number, balance) => sum + balance.balance, 0);
      }
      availableBalance += parent.balance;
      return availableBalance;
    },
  },
};
