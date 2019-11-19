import AccountsOperation from '../operations/AccountsOperation';

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
  },
};
