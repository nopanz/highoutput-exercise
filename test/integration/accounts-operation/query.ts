export const UPDATE_BALANCE = `mutation ($account: ID!, $delta: Float! ){
    updateBalance(account: $account,delta: $delta)
  }`;

export const CREATE_RESERVED_BALANCE = `mutation ($account: ID!, $context: String!, $amount: Float!){
    createReservedBalance(account: $account, context: $context, amount: $amount)
  }`;

export const UPDATE_RESERVED_BALANCE = `mutation ($account:ID!,$context: String!,$delta: Float!) {
    updateReservedBalance(account:$account, context: $context, delta: $delta)
  }`;

export const RELEASE_RESERVED_BALANCE = `mutation ($account: ID!, $context: String!) {
    releaseReservedBalance(account: $account, context: $context)
  }`;


export const UPDATE_VIRTUAL_BALANCE = `mutation ($account: ID!, $delta: Float!, $context: String! ){
    updateVirtualBalance(account: $account,delta: $delta, context: $context)
  }`;

export const CANCEL_VIRTUAL_BALANCE = `mutation ($account: ID!, $context: String!) {
    cancelVirtualBalance(account: $account, context: $context)
  }`;
