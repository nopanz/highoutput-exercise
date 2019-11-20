
import Loader from '@app/graphql/Loader';
import { Account } from '@app/models/Account';
import { Balance } from '@app/models/Balance';

export default {
  Account: {
    reservedBalance: async (
      parent: Account,
      args: {context: string},
      ctx: {loader: Loader},
    ) => {
      const balance = await ctx.loader.reservedBalance.load(`${args.context}:${parent._id}`);
      return (balance && balance.balance) || 0;
    },
    virtualBalance: async (
      parent: Account,
      args: {context: string},
      ctx: {loader: Loader}) => {
      const balance = await ctx.loader.virtualBalance.load(`${args.context}:${parent._id}`);
      return (balance && balance.balance) || 0;
    },
    availableBalance: async (
      parent: Account,
      args: {context: string},
      ctx: {loader: Loader}) => {
      let availableBalance = 0;
      const balances = await ctx.loader.availableBalance.load(`${args.context}:${parent._id}`);
      if (balances.length > 0) {
        availableBalance += balances.reduce((
          sum: number,
          balance: Balance,
        ) => sum + balance.balance, 0);
      }
      availableBalance += parent.balance;
      return availableBalance;
    },
  },
};
