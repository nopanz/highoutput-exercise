# Instructions

The goal of this exercise is to implement an API service based on the given `GraphQL` schema. The code base must be written in `Typescript` and must run on top of `NodeJS`. The environment, including the third party services such as the database and the cache, must be setup using `docker-compose` and must start by running `docker-compose up -d`. The API service must start by running `npm start`. Unit and/or integration tests must be written and must cover at least 80% of the code base. Any database technology may be used in the implementation.

## Idempotency

An optional `X-Request-ID` header may be set by the client. If `X-Request-ID` is set, then the request handler must be idempotent. Requests with the same `X-Request-ID` must be treated as retry instances of the same request. Idempotency of a request must take effect for up to 24 hours since the first instance of the request was received.

# Schema

## Account

Object representing the user account.

### Fields

| Field             | Description                                                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | Unique ID of the user account. The `id` is determined by the client and if the account object associated with the `id` does not exist in the database, then a default value of `0` must be assigned to the current balance. |
| `balance`         | Balance that is currently held by the user.                                                                                                                                                                                 |
| `reservedBalance` | Balance that is reserved for a specific context. Creating a reseved balance involves subtracting a portion of the current balance. All accounts must have a default reserved balance of `0` for all contexts.               |
| `virtualBalance`  | Balance held by the user for a specific context. May be added to the current balance by calling `commitVirtualBalance`. All accounts must have a default virtual balance of `0` for all contexts.                           |

## Query

### Fields

| Field      | Description                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `account`  | User account.                                                                                                                                                      |
| `accounts` | Paginated list of user accounts. Must return only the accounts with non-zero values for `Account.balance`, `Account.reservedBalance` and `Account.virtualBalance`. |

## Mutation

### Fields

| Field                    | Description                                                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateBalance`          | Update the current balance. The `delta` parameter may either be positive or negative. An `updateBalance` request that results into the current balance becoming negative must be considered invalid. |
| `createReservedBalance`  | Subtract the `amount` from the current balance and add it into the reserved balance associated with the given context.                                                                               |
| `updateReservedBalance`  | Update the reserved balance associated with the given context. An `updateReservedBalance` request that results into the reserved balance becoming negative must be considered invalid.               |
| `releaseReservedBalance` | Reset the reserved balance to zero and add it into the current balance.                                                                                                                              |  |
| `updateVirtualBalance`   | Update the virtual balance associated with the given context. An `updateVirtualBalance` request that results into the virtual balance becoming negative must be considered invalid.                  |
| `cancelVirtualBalance`   | Reset the virtual balance associated with the given context to zero.                                                                                                                                 |
| `commitVirtualBalance`   | Reset the virtual balanceto zero and add it into the current balance.                                                                                                                                |
