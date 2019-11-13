import AccountsOperation from '../operations/AccountsOperation';

export default {
  Mutation: {
    updateBalance: async (root: any, { account, delta }: {account: string, delta: number}) => {
      const op = new AccountsOperation();
      op.account = account;
      op.delta = delta;
      await op.updateBalance();
      return true;
    },
  },
};
