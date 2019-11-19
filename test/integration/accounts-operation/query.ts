export const UPDATE_BALANCE = `mutation ($account: ID!, $delta: Float! ){
    updateBalance(account: $account,delta: $delta)
  }`;

export const CREATE_RESERVED_BALANCE = `mutation ($account: ID!, $context: String!, $amount: Float!){
    createReservedBalance(account: $account, context: $context, amount: $amount)
  }`;

export const UPDATE_RESERVED_BALANCE = `mutation ($account:ID!,$context: String!,$delta: Float!) {
    updateReservedBalance(account:$account, context: $context, delta: $delta)
  }`;
