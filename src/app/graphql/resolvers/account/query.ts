import AccountModel, { Account } from '@app/models/Account';
import AppError from '@app/graphql/AppError';

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

      if (args.after) {
        accounts = await AccountModel.find({ _id: { $gt: args.after } }).limit(args.first);
      } else {
        accounts = await AccountModel.find().limit(args.first);
      }
      return accounts;
    },
  },
};
