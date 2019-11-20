import AccountModel, { Account } from '@app/models/Account';

export default {
  AccountsConnection: {
    totalCount: () => AccountModel.countDocuments().exec(),
    edges: (parent: Account[]) => parent,
    pageInfo: (parent: Account[]) => (parent.length > 0 ? parent[parent.length - 1] : {}),
  },
  AccountsConnectionEdge: {
    node: (parent: object) => parent,
    cursor: (parent: Account) => parent._id,
  },
  PageInfo: {
    endCursor: (parent: {_id: number | undefined}) => (parent && parent._id) || null,
    hasNextPage: async (parent: {_id: number | undefined}) => {
      let hasNextPage: Account | null;
      if (parent !== undefined) {
        hasNextPage = await AccountModel.findOne({ _id: { $gt: parent._id } }).exec();
      } else {
        return false;
      }
      return hasNextPage instanceof AccountModel;
    },
  },
};
