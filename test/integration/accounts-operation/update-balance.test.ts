
import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { UPDATE_BALANCE } from './query';
import Account from '../../../src/app/models/Account';


describe('Update Balance API', () => {
  const accountId = '1234';
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });

  it('should create account if not exist', async () => {
    let existingAccount = await Account.findOne({ id: accountId }).exec();
    assert.isNotOk(existingAccount);
    await request.post('/graphql').send(
      {
        query: UPDATE_BALANCE,
        variables: {
          account: accountId,
          delta: 100,
        },
      },
    ).expect(200);
    existingAccount = await Account.findOne({ id: accountId }).exec();
    assert.equal(existingAccount && existingAccount.id, accountId);
  });

  it('should increase existing balance if delta is positive number', async () => {
    let existingAccount = await Account.findOne({ id: accountId }).exec();
    const expectedBalance = existingAccount && existingAccount.balance + 30;

    await request.post('/graphql').send({
      query: UPDATE_BALANCE,
      variables: {
        account: accountId,
        delta: 30,
      },
    }).expect(200);

    existingAccount = await Account.findOne({ id: accountId }).exec();

    assert.equal(existingAccount && existingAccount.balance, expectedBalance);
  });

  it('should increase existing balance if delta is negative number', async () => {
    let existingAccount = await Account.findOne({ id: accountId }).exec();
    const expectedBalance = existingAccount && existingAccount.balance + (-30);

    await request.post('/graphql').send({
      query: UPDATE_BALANCE,
      variables: {
        account: accountId,
        delta: -30,
      },
    }).expect(200);
    existingAccount = await Account.findOne({ id: accountId }).exec();

    assert.equal(existingAccount && existingAccount.balance, expectedBalance);
  });
});
