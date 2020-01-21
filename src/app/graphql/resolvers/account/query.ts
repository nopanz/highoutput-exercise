import AccountModel, { Account } from '@app/models/Account';
import AppError from '@app/graphql/AppError';
import os from 'os';

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
      let accounts: Account[];
      const first = args.first + 1;

      if (args.after) {
        const after = Buffer.from(args.after, 'base64');
        accounts = await AccountModel.find({ _id: { $gt: after.toString() } }).lean().limit(first);
      } else {
        accounts = await AccountModel.find().lean().limit(first);
      }

      return {
        nodes: accounts,
        first: args.first,
      };
    },
    host: async () => os.hostname(),
  },
};
