import { assert } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import App from '../../../src/app/app';
import AccountModel, { Account } from '../../../src/app/models/Account';
// import Balance from '../../../src/app/models/Balance';
import { GET_ACCOUNTS } from './query';

describe.only('Accounts Query API', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
    await mongoose.connection.db.collection('accounts').drop();
  });

  it('should query accounts', async () => {
    let index = 0;
    const accounts: Promise<Account>[] = [];
    while (index < 6) {
      const account = new AccountModel({
        id: Math.floor(1000 + Math.random() * 9000),
      });
      accounts.push(account.save());
      index += 1;
    }
    await Promise.all(accounts);
    const count = await AccountModel.find().countDocuments().exec();
    const endCursor = await AccountModel.findOne().skip(4).limit(1);
    const response = await request.post('/graphql').send(
      {
        query: GET_ACCOUNTS,
        variables: {
          first: 5,
          reservedContext: 'tanjiro',
          virtualContext: 'naruto',
          availableContext: 'naruto',
        },
      },
    ).expect(200);
    const { accounts: { totalCount, pageInfo } } = response.body.data;
    assert.equal(totalCount, count);
    assert.equal(Buffer.from(pageInfo.endCursor).toString(), endCursor && endCursor._id.toString());
    assert.equal(pageInfo.hasNextPage, true);
  });

  it('should query accounts with argument "after"', async () => {
    let index = 0;
    const accounts: Promise<Account>[] = [];
    while (index < 10) {
      const account = new AccountModel({
        id: Math.floor(1000 + Math.random() * 9000),
      });
      accounts.push(account.save());
      index += 1;
    }
    await Promise.all(accounts);
    const afterCursor = await AccountModel.findOne().skip(4).sort({ _id: 1 }).exec();
    const endCursor = await AccountModel.findOne(
      { _id: { $gt: afterCursor && afterCursor._id.toString() } },
    ).skip(4).exec();
    const response = await request.post('/graphql').send(
      {
        query: GET_ACCOUNTS,
        variables: {
          first: 5,
          after: afterCursor && Buffer.from(afterCursor._id.toString()),
          reservedContext: 'tanjiro',
          virtualContext: 'naruto',
          availableContext: 'naruto',
        },
      },
    ).expect(200);
    const { accounts: { totalCount, pageInfo } } = response.body.data;
    assert.equal(totalCount, 10);
    assert.equal(Buffer.from(pageInfo.endCursor).toString(), endCursor && endCursor._id.toString());
    assert.equal(pageInfo.hasNextPage, false);
  });
});
