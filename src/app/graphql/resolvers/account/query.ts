import AccountModel, { Account } from '@app/models/Account';
import AppError from '@app/graphql/AppError';
import { QueryCursor } from 'mongoose';

export default {
  Query: {
    account: async (root: object, args: {id: string}) => {
      const account = await AccountModel.findOne({ id: args.id }).exec();
      if (!account) {
        throw new AppError('Account does not exist', AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }
      return account;
    },
    accounts: async (root: object, args: {first: number; after: string}) => {
      let nodes: Account[] = [];
      let hasNextPage = false;
      let accounts: QueryCursor<Account>;

      if (args.after) {
        accounts = await AccountModel.find(
          { _id: { $gt: args.after } },
        ).lean().limit(args.first + 1).cursor();
      } else {
        accounts = await AccountModel.find().lean().limit(args.first + 1).cursor();
      }
      await accounts.eachAsync((account) => {
        nodes.push(account);
      });
      if (nodes.length > args.first) {
        hasNextPage = true;
        nodes = nodes.splice(0, -1);
      }
      return {
        nodes,
        hasNextPage,
      };
    },
  },
};
