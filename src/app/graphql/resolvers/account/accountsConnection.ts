import AccountModel, { Account } from '@app/models/Account';

export default {
  AccountsConnection: {
    totalCount: () => AccountModel.countDocuments().exec(),
    edges: (parent: {nodes: Account[]; first: number}) => {
      if (parent.nodes.length > parent.first) return parent.nodes.slice(0, -1);
      return parent.nodes;
    },
    pageInfo: (parent: object) => parent,
  },
  AccountsConnectionEdge: {
    node: (parent: object) => parent,
    cursor: (parent: Account) => Buffer.from(parent._id.toString()),
  },
  PageInfo: {
    endCursor: (parent: {nodes: Account[]; first: number}) => {
      const { nodes, first } = parent;
      if (nodes.length > first) {
        const endCursor = nodes.slice(0, -1).pop();
        return endCursor && Buffer.from(endCursor._id.toString());
      }
      return nodes.length > 0 ? Buffer.from(nodes[nodes.length - 1]._id.toString()) : null;
    },
    hasNextPage: (
      parent: {
        nodes: Account[];
        first: number;
      },
    ) => parent.nodes.length > parent.first,
  },
};
