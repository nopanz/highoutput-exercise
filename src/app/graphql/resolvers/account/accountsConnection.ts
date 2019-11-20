import AccountModel, { Account } from '@app/models/Account';

export default {
  AccountsConnection: {
    totalCount: () => AccountModel.countDocuments().exec(),
    edges: (parent: {nodes: Account[]}) => parent.nodes,
    pageInfo: (parent: {nodes: Account[]; hasNextPage: boolean}) => {
      const { nodes, hasNextPage } = parent;
      return {
        endCursor: nodes.length > 0 ? nodes[nodes.length - 1]._id : null,
        hasNextPage,
      };
    },
  },
  AccountsConnectionEdge: {
    node: (parent: object) => parent,
    cursor: (parent: Account) => parent._id,
  },
};
